package rw.maritime.nvg.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import rw.maritime.nvg.DTO.CargoRequest;
import rw.maritime.nvg.exception.InsufficientCargoCapacityException;
import rw.maritime.nvg.exception.ResourceNotFoundException;
import rw.maritime.nvg.exception.ValidationException;
import rw.maritime.nvg.model.Cargo;
import rw.maritime.nvg.model.CargoStatus;
import rw.maritime.nvg.service.CargoService;

import java.util.List;
import java.util.Map;

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
    public ResponseEntity<?> createCargo(
            @Valid @RequestBody CargoRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult.getFieldErrors());
        }

        try {
            Cargo createdCargo = cargoService.createCargo(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCargo);
        } catch (InsufficientCargoCapacityException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "INSUFFICIENT_CARGO_CAPACITY",
                            "message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "INVALID_REQUEST",
                            "message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "RESOURCE_NOT_FOUND",
                            "message", e.getMessage()));
        }
    }

    @PostMapping("/schedule/{scheduleId}/check-capacity")
    public ResponseEntity<Map<String, Object>> checkCargoCapacity(
            @PathVariable Long scheduleId,
            @RequestBody Map<String, Double> request) {
        try {
            double weight = request.get("weight");
            boolean canBook = cargoService.canBookCargo(scheduleId, weight);
            double availableCapacity = cargoService.getAvailableCargoCapacity(scheduleId);

            return ResponseEntity.ok(Map.of(
                    "canBook", canBook,
                    "availableCapacity", availableCapacity,
                    "requestedWeight", weight,
                    "message", canBook ? "Cargo can be booked" : "Insufficient cargo capacity"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "SCHEDULE_NOT_FOUND",
                            "message", e.getMessage()));
        }
    }

    @GetMapping("/schedule/{scheduleId}/capacity")
    public ResponseEntity<Map<String, Object>> getCargoCapacity(@PathVariable Long scheduleId) {
        try {
            CargoService.CargoCapacitySummary summary = cargoService.getCargoCapacitySummary(scheduleId);

            return ResponseEntity.ok(Map.of(
                    "totalCapacity", summary.getTotalCapacity(),
                    "bookedWeight", summary.getBookedWeight(),
                    "availableCapacity", summary.getAvailableCapacity(),
                    "utilizationPercentage", summary.getUtilizationPercentage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "SCHEDULE_NOT_FOUND",
                            "message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Cargo> updateCargoStatus(
            @PathVariable Long id,
            @RequestParam @NotBlank CargoStatus status) {
        try {
            Cargo updatedCargo = cargoService.updateCargoStatus(id, status);
            return ResponseEntity.ok(updatedCargo);
        } catch (RuntimeException e) {
            throw new ResourceNotFoundException("Cargo not found with id: " + id);
        }
    }

    @PatchMapping("/{id}/weight")
    public ResponseEntity<?> updateCargoWeight(
            @PathVariable Long id,
            @RequestBody Map<String, Double> request) {
        try {
            double newWeight = request.get("weight");
            if (newWeight <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "error", "INVALID_WEIGHT",
                                "message", "Weight must be positive"));
            }

            Cargo updatedCargo = cargoService.updateCargoWeight(id, newWeight);
            return ResponseEntity.ok(updatedCargo);
        } catch (InsufficientCargoCapacityException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "INSUFFICIENT_CARGO_CAPACITY",
                            "message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "CARGO_NOT_FOUND",
                            "message", e.getMessage()));
        }
    }

    @GetMapping("/schedule/{scheduleId}/utilization")
    public ResponseEntity<Map<String, Object>> getCargoUtilization(@PathVariable Long scheduleId) {
        try {
            double utilizationPercentage = cargoService.getCargoUtilizationPercentage(scheduleId);
            double totalCapacity = cargoService.getTotalCargoCapacity(scheduleId);
            double bookedWeight = cargoService.getBookedCargoWeight(scheduleId);

            String utilizationLevel;
            if (utilizationPercentage >= 90) {
                utilizationLevel = "HIGH";
            } else if (utilizationPercentage >= 70) {
                utilizationLevel = "MEDIUM";
            } else {
                utilizationLevel = "LOW";
            }

            return ResponseEntity.ok(Map.of(
                    "utilizationPercentage", utilizationPercentage,
                    "utilizationLevel", utilizationLevel,
                    "totalCapacity", totalCapacity,
                    "bookedWeight", bookedWeight,
                    "availableCapacity", totalCapacity - bookedWeight));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "SCHEDULE_NOT_FOUND",
                            "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCargo(@PathVariable Long id) {
        try {
            cargoService.deleteCargo(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            throw new ResourceNotFoundException("Cargo not found with id: " + id);
        }
    }
}