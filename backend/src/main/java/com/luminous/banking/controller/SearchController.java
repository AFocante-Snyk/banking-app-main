package com.luminous.banking.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ⚠️ VULNERABLE CONTROLLER - FOR EDUCATIONAL PURPOSES ONLY ⚠️
 * 
 * This controller contains intentional security vulnerabilities to demonstrate:
 * 1. SQL Injection attacks
 * 2. Reflected XSS attacks
 * 
 * DO NOT USE IN PRODUCTION
 */
@RestController
@RequestMapping("/api/v1/search")
@Tag(name = "Search (VULNERABLE)", description = "⚠️ INTENTIONALLY VULNERABLE - Educational Demo Only")
@CrossOrigin(origins = "*")
@Slf4j
public class SearchController {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * ⚠️ SQL INJECTION VULNERABILITY ⚠️
     * 
     * This endpoint is vulnerable to SQL injection because it concatenates
     * user input directly into the SQL query string.
     * 
     * Example attack payloads:
     * - ' OR '1'='1
     * - '; DROP TABLE customers; --
     * - ' UNION SELECT * FROM customers WHERE '1'='1
     */
    @GetMapping("/customers")
    @Operation(
        summary = "⚠️ VULNERABLE - Search customers by name",
        description = "This endpoint is intentionally vulnerable to SQL injection for educational purposes"
    )
    public ResponseEntity<?> searchCustomers(@RequestParam String name) {
        log.warn("⚠️ Executing vulnerable SQL query with user input: {}", name);
        
        // ⚠️ VULNERABLE: String concatenation in SQL query
        // This allows SQL injection attacks!
        String sql = "SELECT * FROM customers WHERE first_name LIKE '%" + name + "%' OR last_name LIKE '%" + name + "%'";
        
        try {
            Query query = entityManager.createNativeQuery(sql);
            List<?> results = query.getResultList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("query", sql);  // Also bad practice - exposing query
            response.put("results", results);
            response.put("count", results.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // ⚠️ VULNERABLE: Exposing error details including SQL
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("query", sql);
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * ⚠️ SQL INJECTION VULNERABILITY ⚠️
     * 
     * Another vulnerable endpoint for account searches
     */
    @GetMapping("/accounts")
    @Operation(
        summary = "⚠️ VULNERABLE - Search accounts by number",
        description = "This endpoint is intentionally vulnerable to SQL injection"
    )
    public ResponseEntity<?> searchAccounts(@RequestParam String accountNumber) {
        log.warn("⚠️ Executing vulnerable SQL query for account: {}", accountNumber);
        
        // ⚠️ VULNERABLE: Direct string concatenation
        String sql = "SELECT * FROM accounts WHERE account_number = '" + accountNumber + "'";
        
        try {
            Query query = entityManager.createNativeQuery(sql);
            List<?> results = query.getResultList();
            
            return ResponseEntity.ok(Map.of(
                "query", sql,
                "results", results
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage(),
                "query", sql
            ));
        }
    }

    /**
     * ⚠️ REFLECTED XSS VULNERABILITY ⚠️
     * 
     * This endpoint reflects user input without sanitization,
     * allowing XSS attacks when the response is rendered in a browser.
     * 
     * Example attack payload:
     * - <script>alert('XSS')</script>
     * - <img src=x onerror="alert('XSS')">
     */
    @GetMapping("/echo")
    @Operation(
        summary = "⚠️ VULNERABLE - Echo message (XSS)",
        description = "This endpoint reflects user input without sanitization - vulnerable to XSS"
    )
    public ResponseEntity<Map<String, String>> echoMessage(@RequestParam String message) {
        log.warn("⚠️ Echoing unsanitized user input: {}", message);
        
        // ⚠️ VULNERABLE: Returning unsanitized user input
        // When rendered as HTML, this allows XSS attacks
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        response.put("html", "<div class='user-message'>" + message + "</div>");
        
        return ResponseEntity.ok(response);
    }

    /**
     * ⚠️ VULNERABLE TRANSACTION SEARCH ⚠️
     * 
     * Demonstrates SQL injection in transaction queries
     */
    @GetMapping("/transactions")
    @Operation(
        summary = "⚠️ VULNERABLE - Search transactions",
        description = "Vulnerable to SQL injection via multiple parameters"
    )
    public ResponseEntity<?> searchTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String minAmount,
            @RequestParam(required = false) String maxAmount) {
        
        // ⚠️ VULNERABLE: Building SQL with string concatenation
        StringBuilder sql = new StringBuilder("SELECT * FROM transactions WHERE 1=1");
        
        if (type != null && !type.isEmpty()) {
            sql.append(" AND type = '").append(type).append("'");
        }
        if (minAmount != null && !minAmount.isEmpty()) {
            sql.append(" AND amount >= ").append(minAmount);
        }
        if (maxAmount != null && !maxAmount.isEmpty()) {
            sql.append(" AND amount <= ").append(maxAmount);
        }
        
        log.warn("⚠️ Executing vulnerable query: {}", sql);
        
        try {
            Query query = entityManager.createNativeQuery(sql.toString());
            return ResponseEntity.ok(Map.of(
                "query", sql.toString(),
                "results", query.getResultList()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage(),
                "query", sql.toString()
            ));
        }
    }
}

