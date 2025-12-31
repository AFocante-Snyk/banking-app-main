package com.luminous.banking.service;

import com.luminous.banking.dto.*;
import com.luminous.banking.entity.Account;
import com.luminous.banking.entity.Account.AccountStatus;
import com.luminous.banking.entity.Customer;
import com.luminous.banking.entity.Transaction;
import com.luminous.banking.entity.Transaction.TransactionType;
import com.luminous.banking.exception.InsufficientFundsException;
import com.luminous.banking.exception.InvalidOperationException;
import com.luminous.banking.exception.ResourceNotFoundException;
import com.luminous.banking.repository.AccountRepository;
import com.luminous.banking.repository.CustomerRepository;
import com.luminous.banking.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;
    private final InterestRateService interestRateService;
    private final ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public List<AccountDTO> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AccountDTO getAccountById(UUID id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        return convertToDTO(account);
    }

    @Transactional(readOnly = true)
    public AccountDTO getAccountByNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with number: " + accountNumber));
        return convertToDTO(account);
    }

    @Transactional(readOnly = true)
    public List<AccountDTO> getAccountsByCustomerId(UUID customerId) {
        return accountRepository.findByCustomerId(customerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AccountDTO openAccount(OpenAccountRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));

        // Get personalized interest rate from AI service
        int age = Period.between(customer.getDateOfBirth(), java.time.LocalDate.now()).getYears();
        InterestRateResponse rateResponse = interestRateService.getInterestRate(
                InterestRateRequest.builder()
                        .creditScore(customer.getCreditScore())
                        .annualIncome(customer.getAnnualIncome())
                        .employmentStatus(customer.getEmploymentStatus())
                        .age(age)
                        .accountType(request.getAccountType())
                        .state(customer.getState())
                        .build()
        );

        if (!rateResponse.getApproved()) {
            throw new InvalidOperationException("Account opening not approved: " + rateResponse.getExplanation());
        }

        Account account = Account.builder()
                .accountType(request.getAccountType())
                .balance(request.getInitialDeposit() != null ? request.getInitialDeposit() : BigDecimal.ZERO)
                .interestRate(rateResponse.getInterestRate())
                .status(AccountStatus.ACTIVE)
                .customer(customer)
                .build();

        Account savedAccount = accountRepository.save(account);

        // Record initial deposit as transaction if applicable
        if (request.getInitialDeposit() != null && request.getInitialDeposit().compareTo(BigDecimal.ZERO) > 0) {
            Transaction transaction = Transaction.builder()
                    .type(TransactionType.DEPOSIT)
                    .amount(request.getInitialDeposit())
                    .balanceAfter(savedAccount.getBalance())
                    .destinationAccount(savedAccount)
                    .description("Initial deposit")
                    .build();
            transactionRepository.save(transaction);
        }

        return convertToDTO(savedAccount);
    }

    @Transactional
    public AccountDTO closeAccount(UUID accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        if (account.getStatus() == AccountStatus.CLOSED) {
            throw new InvalidOperationException("Account is already closed");
        }

        if (account.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            throw new InvalidOperationException("Account has remaining balance. Please withdraw all funds before closing.");
        }

        account.setStatus(AccountStatus.CLOSED);
        account.setClosedAt(LocalDateTime.now());

        Account closedAccount = accountRepository.save(account);
        return convertToDTO(closedAccount);
    }

    @Transactional
    public TransactionDTO deposit(String accountNumber, BigDecimal amount, String description) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with number: " + accountNumber));

        validateAccountActive(account);

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .type(TransactionType.DEPOSIT)
                .amount(amount)
                .balanceAfter(account.getBalance())
                .destinationAccount(account)
                .description(description != null ? description : "Deposit")
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertTransactionToDTO(savedTransaction);
    }

    @Transactional
    public TransactionDTO withdraw(String accountNumber, BigDecimal amount, String description) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with number: " + accountNumber));

        validateAccountActive(account);

        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient funds for withdrawal");
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        Transaction transaction = Transaction.builder()
                .type(TransactionType.WITHDRAWAL)
                .amount(amount)
                .balanceAfter(account.getBalance())
                .sourceAccount(account)
                .description(description != null ? description : "Withdrawal")
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertTransactionToDTO(savedTransaction);
    }

    @Transactional
    public TransactionDTO transfer(TransferRequest request) {
        Account sourceAccount = accountRepository.findByAccountNumber(request.getSourceAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Source account not found: " + request.getSourceAccountNumber()));

        Account destinationAccount = accountRepository.findByAccountNumber(request.getDestinationAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Destination account not found: " + request.getDestinationAccountNumber()));

        validateAccountActive(sourceAccount);
        validateAccountActive(destinationAccount);

        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException("Insufficient funds for transfer");
        }

        // Perform transfer
        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        destinationAccount.setBalance(destinationAccount.getBalance().add(request.getAmount()));

        accountRepository.save(sourceAccount);
        accountRepository.save(destinationAccount);

        Transaction transaction = Transaction.builder()
                .type(TransactionType.TRANSFER)
                .amount(request.getAmount())
                .balanceAfter(sourceAccount.getBalance())
                .sourceAccount(sourceAccount)
                .destinationAccount(destinationAccount)
                .description(request.getDescription() != null ? request.getDescription() : "Transfer")
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertTransactionToDTO(savedTransaction);
    }

    private void validateAccountActive(Account account) {
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new InvalidOperationException("Account is not active. Current status: " + account.getStatus());
        }
    }

    private AccountDTO convertToDTO(Account account) {
        AccountDTO dto = modelMapper.map(account, AccountDTO.class);
        dto.setCustomerId(account.getCustomer().getId());
        dto.setCustomerName(account.getCustomer().getFirstName() + " " + account.getCustomer().getLastName());
        return dto;
    }

    private TransactionDTO convertTransactionToDTO(Transaction transaction) {
        TransactionDTO dto = modelMapper.map(transaction, TransactionDTO.class);
        if (transaction.getSourceAccount() != null) {
            dto.setSourceAccountNumber(transaction.getSourceAccount().getAccountNumber());
        }
        if (transaction.getDestinationAccount() != null) {
            dto.setDestinationAccountNumber(transaction.getDestinationAccount().getAccountNumber());
        }
        return dto;
    }
}

