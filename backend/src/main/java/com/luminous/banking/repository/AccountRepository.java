package com.luminous.banking.repository;

import com.luminous.banking.entity.Account;
import com.luminous.banking.entity.Account.AccountStatus;
import com.luminous.banking.entity.Account.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

    Optional<Account> findByAccountNumber(String accountNumber);

    List<Account> findByCustomerId(UUID customerId);

    List<Account> findByCustomerIdAndStatus(UUID customerId, AccountStatus status);

    List<Account> findByCustomerIdAndAccountType(UUID customerId, AccountType accountType);

    boolean existsByAccountNumber(String accountNumber);
}

