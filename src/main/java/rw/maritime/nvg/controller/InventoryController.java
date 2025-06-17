package rw.maritime.nvg.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import rw.maritime.nvg.DTO.InventoryRequest;
import rw.maritime.nvg.exception.ResourceNotFoundException;
import rw.maritime.nvg.exception.ValidationException;
import rw.maritime.nvg.model.Inventory;
import rw.maritime.nvg.service.InventoryService;

import java.time.LocalDate;
import java.util.List;

/**
 * REST controller for managing vessel inventory and maintenance records
 */
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventories() {
        List<Inventory> inventories = inventoryService.getAllInventories();
        return ResponseEntity.ok(inventories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getInventoryById(@PathVariable Long id) {
        return inventoryService.getInventoryById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory record not found with id: " + id));
    }

    @GetMapping("/vessel/{vesselId}")
    public ResponseEntity<Inventory> getInventoryByVessel(@PathVariable Long vesselId) {
        return inventoryService.getInventoryByVessel(vesselId)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory record not found for vessel id: " + vesselId));
    }

    @GetMapping("/maintenance-due")
    public ResponseEntity<List<Inventory>> getVesselsDueForMaintenance() {
        List<Inventory> inventories = inventoryService.getVesselsDueForMaintenance();
        return inventories.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(inventories);
    }

    @GetMapping("/understaffed")
    public ResponseEntity<List<Inventory>> getUnderstaffedVessels(
            @RequestParam(defaultValue = "10") int minCrewCount) {
        if (minCrewCount < 1) {
            throw new ValidationException("Minimum crew count must be at least 1");
        }
        List<Inventory> inventories = inventoryService.getUnderstaffedVessels(minCrewCount);
        return inventories.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(inventories);
    }

    @PostMapping
    public ResponseEntity<Inventory> createInventory(
            @Valid @RequestBody InventoryRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult.getFieldErrors());
        }
        if (request.getLastMaintenance() != null && 
            request.getLastMaintenance().isAfter(LocalDate.now())) {
            throw new ValidationException("Last maintenance date cannot be in the future");
        }
        
        Inventory createdInventory = inventoryService.createInventory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdInventory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventory(
            @PathVariable Long id,
            @Valid @RequestBody InventoryRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult.getFieldErrors());
        }
        if (request.getLastMaintenance() != null && 
            request.getLastMaintenance().isAfter(LocalDate.now())) {
            throw new ValidationException("Last maintenance date cannot be in the future");
        }
        
        return ResponseEntity.ok(inventoryService.updateInventory(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }
}