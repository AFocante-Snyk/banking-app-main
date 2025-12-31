package com.luminous.banking.dto;

import com.luminous.banking.entity.Account.AccountType;
import com.luminous.banking.entity.Customer.EmploymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterestRateRequest {

    private Integer creditScore;
    private Double annualIncome;
    private EmploymentStatus employmentStatus;
    private Integer age;
    private AccountType accountType;
    private String state;
}

