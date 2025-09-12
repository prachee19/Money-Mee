package com.me.moneymanager.controller;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.me.moneymanager.service.IncomeService;
import com.me.moneymanager.service.ExpenseService; 

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/excel/download")
@CrossOrigin(origins = "http://localhost:5173")
public class ExcelController {

    private final IncomeService incomeService;
   private final ExpenseService expenseService;

    @GetMapping("/income")
    public ResponseEntity<InputStreamResource> downloadIncomeExcel() throws IOException {

        // Generate Excel file as byte array
        ByteArrayInputStream in = incomeService.generateIncomeExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=income_details.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(in));
    }


    @GetMapping("/expense")
    public ResponseEntity<InputStreamResource> downloadExpenseExcel() throws IOException {
        // Generate Excel file as byte array
        ByteArrayInputStream in = expenseService.generateExpenseExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=expense_details.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(in));
    }












}
