package com.me.moneymanager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.me.moneymanager.service.DashboardService;

import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor

public class DashBoardController {
    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> dashboardData = dashboardService.getDashboardData();
        return ResponseEntity.ok(dashboardData);
    }

}
