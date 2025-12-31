package com.luminous.banking.service;

import com.luminous.banking.dto.InterestRateRequest;
import com.luminous.banking.dto.InterestRateResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InterestRateService {

    private final RestTemplate restTemplate;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public InterestRateResponse getInterestRate(InterestRateRequest request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<InterestRateRequest> entity = new HttpEntity<>(request, headers);

            String url = aiServiceUrl + "/api/v1/interest-rate/calculate";
            InterestRateResponse response = restTemplate.postForObject(url, entity, InterestRateResponse.class);

            if (response != null) {
                return response;
            }
        } catch (RestClientException e) {
            log.warn("AI service unavailable, using fallback interest rate calculation: {}", e.getMessage());
        }

        // Fallback calculation if AI service is unavailable
        return calculateFallbackInterestRate(request);
    }

    private InterestRateResponse calculateFallbackInterestRate(InterestRateRequest request) {
        BigDecimal baseRate;
        String riskCategory;
        boolean approved = true;

        // Base rate by account type
        switch (request.getAccountType()) {
            case SAVINGS:
                baseRate = new BigDecimal("0.0450");
                break;
            case MONEY_MARKET:
                baseRate = new BigDecimal("0.0500");
                break;
            case CERTIFICATE_OF_DEPOSIT:
                baseRate = new BigDecimal("0.0550");
                break;
            default:
                baseRate = new BigDecimal("0.0100");
        }

        // Adjust based on credit score
        if (request.getCreditScore() != null) {
            if (request.getCreditScore() >= 750) {
                baseRate = baseRate.add(new BigDecimal("0.0050"));
                riskCategory = "LOW";
            } else if (request.getCreditScore() >= 650) {
                riskCategory = "MEDIUM";
            } else if (request.getCreditScore() >= 550) {
                baseRate = baseRate.subtract(new BigDecimal("0.0025"));
                riskCategory = "HIGH";
            } else {
                baseRate = baseRate.subtract(new BigDecimal("0.0050"));
                riskCategory = "VERY_HIGH";
                if (request.getCreditScore() < 400) {
                    approved = false;
                }
            }
        } else {
            riskCategory = "UNKNOWN";
        }

        return InterestRateResponse.builder()
                .interestRate(baseRate)
                .riskCategory(riskCategory)
                .explanation("Fallback rate calculation based on account type and credit score")
                .factors(List.of("Account Type", "Credit Score"))
                .approved(approved)
                .build();
    }
}

