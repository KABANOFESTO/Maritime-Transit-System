package rw.maritime.nvg.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import rw.maritime.nvg.DTO.ComplianceRequest;
import rw.maritime.nvg.exception.ResourceNotFoundException;
import rw.maritime.nvg.exception.ValidationException;
import rw.maritime.nvg.model.Compliance;
import rw.maritime.nvg.service.ComplianceService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/compliance")
public class ComplianceController {
    private final ComplianceService complianceService;

    public ComplianceController(ComplianceService complianceService) {
        this.complianceService = complianceService;
    }

    @GetMapping
    public ResponseEntity<List<Compliance>> getAllComplianceRecords() {
        List<Compliance> records = complianceService.getAllComplianceRecords();
        return ResponseEntity.ok(records);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compliance> getComplianceById(@PathVariable Long id) {
        return complianceService.getComplianceById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Compliance record not found with id: " + id));
    }

    @GetMapping("/vessel/{vesselId}")
    public ResponseEntity<Compliance> getComplianceByVessel(@PathVariable Long vesselId) {
        return complianceService.getComplianceByVessel(vesselId)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Compliance record not found for vessel id: " + vesselId));
    }

    @GetMapping("/safety/{passed}")
    public ResponseEntity<List<Compliance>> getVesselsWithSafetyChecks(
            @PathVariable boolean passed) {
        List<Compliance> records = complianceService.getVesselsWithSafetyChecks(passed);
        return records.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(records);
    }

    @GetMapping("/documents/{complete}")
    public ResponseEntity<List<Compliance>> getVesselsWithDocumentation(
            @PathVariable boolean complete) {
        List<Compliance> records = complianceService.getVesselsWithDocumentation(complete);
        return records.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(records);
    }

    @GetMapping("/due-for-inspection")
    public ResponseEntity<List<Compliance>> getVesselsDueForInspection() {
        List<Compliance> records = complianceService.getVesselsDueForInspection();
        return records.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(records);
    }

    @PostMapping
    public ResponseEntity<Compliance> createComplianceRecord(
            @Valid @RequestBody ComplianceRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult.getFieldErrors());
        }
        if (request.getLastInspectionDate().isAfter(LocalDate.now())) {
            throw new ValidationException("Inspection date cannot be in the future");
        }
        
        Compliance createdRecord = complianceService.createComplianceRecord(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRecord);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Compliance> updateCompliance(
            @PathVariable Long id,
            @Valid @RequestBody ComplianceRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult.getFieldErrors());
        }
        if (request.getLastInspectionDate() != null && 
            request.getLastInspectionDate().isAfter(LocalDate.now())) {
            throw new ValidationException("Inspection date cannot be in the future");
        }
        
        return ResponseEntity.ok(complianceService.updateCompliance(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompliance(@PathVariable Long id) {
        complianceService.deleteCompliance(id);
        return ResponseEntity.noContent().build();
    }
}