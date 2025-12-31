package com.luminous.banking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterestRateResponse {

    private BigDecimal interestRate;
    private String riskCategory;
    private String explanation;
    private List<String> factors;
    private Boolean approved;
}

