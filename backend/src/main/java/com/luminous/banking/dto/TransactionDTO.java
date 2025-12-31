package com.luminous.banking.dto;

import com.luminous.banking.entity.Transaction.TransactionStatus;
import com.luminous.banking.entity.Transaction.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {

    private UUID id;
    private String transactionReference;
    private TransactionType type;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String sourceAccountNumber;
    private String destinationAccountNumber;
    private String description;
    private TransactionStatus status;
    private LocalDateTime createdAt;
}

