package rw.maritime.nvg.controller;

import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import rw.maritime.nvg.DTO.AnalyticsLogRequest;
import rw.maritime.nvg.exception.ResourceNotFoundException;
import rw.maritime.nvg.exception.ValidationException;
import rw.maritime.nvg.model.AnalyticsLog;
import rw.maritime.nvg.service.AnalyticsLogService;

import java.time.LocalDate;
import java.util.List;
import jakarta.validation.constraints.Positive;


@RestController
@RequestMapping("/api/analytics")
public class AnalyticsLogController {
    private final AnalyticsLogService analyticsLogService;

    public AnalyticsLogController(AnalyticsLogService analyticsLogService) {
        this.analyticsLogService = analyticsLogService;
    }

    @GetMapping
    public ResponseEntity<List<AnalyticsLog>> getAllAnalyticsLogs() {
        List<AnalyticsLog> logs = analyticsLogService.getAllAnalyticsLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnalyticsLog> getAnalyticsLogById(@PathVariable Long id) {
        return analyticsLogService.getAnalyticsLogById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Analytics log not found with id: " + id));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<AnalyticsLog> getAnalyticsLogByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date.isAfter(LocalDate.now())) {
            throw new ValidationException("Date cannot be in the future");
        }
        return analyticsLogService.getAnalyticsLogByDate(date)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Analytics log not found for date: " + date));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<AnalyticsLog>> getAnalyticsLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new ValidationException("Start date must be before end date");
        }
        if (endDate.isAfter(LocalDate.now())) {
            throw new ValidationException("End date cannot be in the future");
        }
        List<AnalyticsLog> logs = analyticsLogService.getAnalyticsLogsByDateRange(startDate, endDate);
        return logs.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(logs);
    }

    @GetMapping("/high-revenue")
    public ResponseEntity<List<AnalyticsLog>> getHighRevenueLogs(
            @RequestParam @Positive double minRevenue) {
        List<AnalyticsLog> logs = analyticsLogService.getHighRevenueLogs(minRevenue);
        return logs.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(logs);
    }

    @PostMapping
    public ResponseEntity<AnalyticsLog> createAnalyticsLog(
            @Valid @RequestBody AnalyticsLogRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult.getFieldErrors());
        }
        if (request.getDate().isAfter(LocalDate.now())) {
            throw new ValidationException("Analytics date cannot be in the future");
        }
        if (request.getRevenue() < 0 || request.getFuelConsumed() < 0 || request.getCargoWeight() < 0) {
            throw new ValidationException("Metrics cannot be negative");
        }
        
        AnalyticsLog createdLog = analyticsLogService.createAnalyticsLog(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLog);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnalyticsLog> updateAnalyticsLog(
            @PathVariable Long id,
            @Valid @RequestBody AnalyticsLogRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult.getFieldErrors());
        }
        if (request.getDate().isAfter(LocalDate.now())) {
            throw new ValidationException("Analytics date cannot be in the future");
        }
        if (request.getRevenue() < 0 || request.getFuelConsumed() < 0 || request.getCargoWeight() < 0) {
            throw new ValidationException("Metrics cannot be negative");
        }
        
        return ResponseEntity.ok(analyticsLogService.updateAnalyticsLog(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnalyticsLog(@PathVariable Long id) {
        analyticsLogService.deleteAnalyticsLog(id);
        return ResponseEntity.noContent().build();
    }
}