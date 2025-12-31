package com.luminous.banking.repository;

import com.luminous.banking.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findBySsn(String ssn);

    boolean existsByEmail(String email);

    boolean existsBySsn(String ssn);
}

