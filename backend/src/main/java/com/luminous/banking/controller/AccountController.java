package com.luminous.banking.controller;

import com.luminous.banking.dto.*;
import com.luminous.banking.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Tag(name = "Account Management", description = "APIs for managing bank accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    @Operation(summary = "Get all accounts", description = "Retrieves a list of all bank accounts")
    public ResponseEntity<List<AccountDTO>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get account by ID", description = "Retrieves a specific account by its ID")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable UUID id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @GetMapping("/number/{accountNumber}")
    @Operation(summary = "Get account by number", description = "Retrieves an account by its account number")
    public ResponseEntity<AccountDTO> getAccountByNumber(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.getAccountByNumber(accountNumber));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get accounts by customer", description = "Retrieves all accounts for a specific customer")
    public ResponseEntity<List<AccountDTO>> getAccountsByCustomerId(@PathVariable UUID customerId) {
        return ResponseEntity.ok(accountService.getAccountsByCustomerId(customerId));
    }

    @PostMapping("/open")
    @Operation(summary = "Open new account", description = "Opens a new bank account with personalized interest rate")
    public ResponseEntity<AccountDTO> openAccount(@Valid @RequestBody OpenAccountRequest request) {
        AccountDTO account = accountService.openAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(account);
    }

    @PostMapping("/{id}/close")
    @Operation(summary = "Close account", description = "Closes an existing bank account")
    public ResponseEntity<AccountDTO> closeAccount(@PathVariable UUID id) {
        return ResponseEntity.ok(accountService.closeAccount(id));
    }

    @PostMapping("/number/{accountNumber}/deposit")
    @Operation(summary = "Deposit funds", description = "Deposits money into an account")
    public ResponseEntity<TransactionDTO> deposit(
            @PathVariable String accountNumber,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String description) {
        return ResponseEntity.ok(accountService.deposit(accountNumber, amount, description));
    }

    @PostMapping("/number/{accountNumber}/withdraw")
    @Operation(summary = "Withdraw funds", description = "Withdraws money from an account")
    public ResponseEntity<TransactionDTO> withdraw(
            @PathVariable String accountNumber,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String description) {
        return ResponseEntity.ok(accountService.withdraw(accountNumber, amount, description));
    }

    @PostMapping("/transfer")
    @Operation(summary = "Transfer funds", description = "Transfers money between two accounts")
    public ResponseEntity<TransactionDTO> transfer(@Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(accountService.transfer(request));
    }
}

