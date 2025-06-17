package rw.maritime.nvg.controller;

import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.constraints.NotBlank;
import rw.maritime.nvg.DTO.ComplaintRequest;
import rw.maritime.nvg.exception.ResourceNotFoundException;
import rw.maritime.nvg.exception.ValidationException;
import rw.maritime.nvg.model.Complaint;
import rw.maritime.nvg.service.ComplaintService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;



@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {
    private final ComplaintService complaintService;
    private static final Set<String> VALID_STATUSES = Set.of(
        "PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"
    );

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        List<Complaint> complaints = complaintService.getAllComplaints();
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaintById(@PathVariable Long id) {
        return complaintService.getComplaintById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Complaint>> getComplaintsByUser(@PathVariable Long userId) {
        List<Complaint> complaints = complaintService.getComplaintsByUser(userId);
        return complaints.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(complaints);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Complaint>> getComplaintsByStatus(
            @PathVariable String status) {
        if (!VALID_STATUSES.contains(status.toUpperCase())) {
            throw new ValidationException("Invalid status. Valid values are: " + VALID_STATUSES);
        }
        List<Complaint> complaints = complaintService.getComplaintsByStatus(status);
        return complaints.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(complaints);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Complaint>> getComplaintsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        if (start.isAfter(end)) {
            throw new ValidationException("Start date must be before end date");
        }
        if (start.isAfter(LocalDateTime.now())) {
            throw new ValidationException("Start date cannot be in the future");
        }
        List<Complaint> complaints = complaintService.getComplaintsByDateRange(start, end);
        return complaints.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(complaints);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Complaint>> searchComplaintsByKeyword(
            @RequestParam String keyword) {
        if (keyword == null || keyword.length() < 3 || keyword.length() > 50) {
            throw new ValidationException("Keyword must be between 3 and 50 characters");
        }
        List<Complaint> complaints = complaintService.searchComplaintsByKeyword(keyword);
        return complaints.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(complaints);
    }

    @PostMapping
    public ResponseEntity<Complaint> createComplaint(
            @Valid @RequestBody ComplaintRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult.getFieldErrors());
        }
        Complaint createdComplaint = complaintService.createComplaint(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComplaint);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(
            @PathVariable Long id,
            @RequestParam @NotBlank String status) {
        if (!VALID_STATUSES.contains(status.toUpperCase())) {
            throw new ValidationException("Invalid status. Valid values are: " + VALID_STATUSES);
        }
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.noContent().build();
    }
}