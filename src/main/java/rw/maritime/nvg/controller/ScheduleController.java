package rw.maritime.nvg.controller;

import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import rw.maritime.nvg.DTO.ScheduleRequest;
import rw.maritime.nvg.exception.ResourceNotFoundException;
import rw.maritime.nvg.exception.ValidationException;
import rw.maritime.nvg.model.Schedule;
import rw.maritime.nvg.service.ScheduleService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {
    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        List<Schedule> schedules = scheduleService.getAllSchedules();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long id) {
        return scheduleService.getScheduleById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
    }

    @GetMapping("/vessel/{vesselId}")
    public ResponseEntity<List<Schedule>> getSchedulesByVessel(@PathVariable Long vesselId) {
        List<Schedule> schedules = scheduleService.getSchedulesByVessel(vesselId);
        return schedules.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(schedules);
    }

    @GetMapping("/route/{routeId}")
    public ResponseEntity<List<Schedule>> getSchedulesByRoute(@PathVariable Long routeId) {
        List<Schedule> schedules = scheduleService.getSchedulesByRoute(routeId);
        return schedules.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(schedules);
    }

    @GetMapping("/departure")
    public ResponseEntity<List<Schedule>> getSchedulesByDepartureWindow(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        if (start.isAfter(end)) {
            throw new ValidationException("Start date must be before end date");
        }
        List<Schedule> schedules = scheduleService.getSchedulesByDepartureWindow(start, end);
        return schedules.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(schedules);
    }

    @GetMapping("/arrival")
    public ResponseEntity<List<Schedule>> getSchedulesByArrivalWindow(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        if (start.isAfter(end)) {
            throw new ValidationException("Start date must be before end date");
        }
        List<Schedule> schedules = scheduleService.getSchedulesByArrivalWindow(start, end);
        return schedules.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(schedules);
    }

    @PostMapping
    public ResponseEntity<Schedule> createSchedule(
            @Valid @RequestBody ScheduleRequest request,
            BindingResult bindingResult) { // BindingResult must be immediately after @Valid parameter
        
        // Check for validation errors first
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult.getFieldErrors());
        }
        
        // Check business logic validation
        if (request.getArrivalTime().isBefore(request.getDepartureTime())) {
            throw new ValidationException("Arrival time must be after departure time");
        }
        
        try {
            Schedule createdSchedule = scheduleService.createSchedule(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSchedule);
        } catch (Exception e) {
            // Log the actual error for debugging
            System.err.println("Error creating schedule: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to let your global exception handler deal with it
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody ScheduleRequest request,
            BindingResult bindingResult) { // BindingResult must be immediately after @Valid parameter
        
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult.getFieldErrors());
        }
        
        if (request.getArrivalTime().isBefore(request.getDepartureTime())) {
            throw new ValidationException("Arrival time must be after departure time");
        }
        
        return ResponseEntity.ok(scheduleService.updateSchedule(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}