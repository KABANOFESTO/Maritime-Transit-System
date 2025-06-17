package rw.maritime.nvg.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import rw.maritime.nvg.DTO.CargoRequest;
import rw.maritime.nvg.exception.ResourceNotFoundException;
import rw.maritime.nvg.exception.ValidationException;
import rw.maritime.nvg.model.Cargo;
import rw.maritime.nvg.service.CargoService;

import java.util.List;

/**
 * REST controller for managing cargo operations in the NGV maritime system
 */
@RestController
@RequestMapping("/api/cargo")
public class CargoController {
    private final CargoService cargoService;

    public CargoController(CargoService cargoService) {
        this.cargoService = cargoService;
    }

    @GetMapping
    public ResponseEntity<List<Cargo>> getAllCargo() {
        List<Cargo> cargoList = cargoService.getAllCargo();
        return ResponseEntity.ok(cargoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cargo> getCargoById(@PathVariable Long id) {
        return cargoService.getCargoById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo not found with id: " + id));
    }

    @GetMapping("/tracking/{trackingNumber}")
    public ResponseEntity<Cargo> getCargoByTrackingNumber(
            @PathVariable String trackingNumber) {
        return cargoService.getCargoByTrackingNumber(trackingNumber)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Cargo not found with tracking number: " + trackingNumber));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Cargo>> getCargoByOwner(
            @PathVariable Long ownerId) {
        List<Cargo> cargoList = cargoService.getCargoByOwner(ownerId);
        if (cargoList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(cargoList);
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<List<Cargo>> getCargoBySchedule(
            @PathVariable Long scheduleId) {
        List<Cargo> cargoList = cargoService.getCargoBySchedule(scheduleId);
        if (cargoList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(cargoList);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Cargo>> getCargoByStatus(
            @PathVariable String status) {
        List<Cargo> cargoList = cargoService.getCargoByStatus(status);
        if (cargoList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(cargoList);
    }

    @PostMapping
    public ResponseEntity<Cargo> createCargo(
            @Valid @RequestBody CargoRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult.getFieldErrors());
        }
        
        Cargo createdCargo = cargoService.createCargo(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCargo);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Cargo> updateCargoStatus(
            @PathVariable Long id,
            @RequestParam @NotBlank String status) {
        Cargo updatedCargo = cargoService.updateCargoStatus(id, status);
        return ResponseEntity.ok(updatedCargo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCargo(@PathVariable Long id) {
        cargoService.deleteCargo(id);
        return ResponseEntity.noContent().build();
    }
}