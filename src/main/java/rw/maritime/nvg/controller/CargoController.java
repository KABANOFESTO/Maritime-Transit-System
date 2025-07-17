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

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public ResponseEntity<?> getCargoById(@PathVariable Long id) {
        try {
            return cargoService.getCargoById(id)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new ResourceNotFoundException("Cargo not found with id: " + id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "CARGO_NOT_FOUND",
                            "message", e.getMessage()));
        }
    }

    @GetMapping("/tracking/{trackingNumber}")
    public ResponseEntity<?> getCargoByTrackingNumber(@PathVariable String trackingNumber) {
        try {
            return cargoService.getCargoByTrackingNumber(trackingNumber)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Cargo not found with tracking number: " + trackingNumber));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "CARGO_NOT_FOUND",
                            "message", e.getMessage()));
        }
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> getCargoByOwner(@PathVariable Long ownerId) {
        try {
            List<Cargo> cargoList = cargoService.getCargoByOwner(ownerId);
            if (cargoList.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(cargoList);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "OWNER_NOT_FOUND",
                            "message", e.getMessage()));
        }
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<?> getCargoBySchedule(@PathVariable Long scheduleId) {
        try {
            List<Cargo> cargoList = cargoService.getCargoBySchedule(scheduleId);
            if (cargoList.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(cargoList);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "SCHEDULE_NOT_FOUND",
                            "message", e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getCargoByStatus(@PathVariable String status) {
        try {
            CargoStatus cargoStatus = CargoStatus.valueOf(status.toUpperCase());
            List<Cargo> cargoList = cargoService.getCargoByStatus(cargoStatus.name());
            if (cargoList.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(cargoList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(getInvalidStatusResponse(status));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "SERVER_ERROR",
                            "message", e.getMessage()));
        }
    }

    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getValidStatuses() {
        List<String> statuses = Arrays.stream(CargoStatus.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(statuses);
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
                            "error", "INSUFFICIENT_CAPACITY",
                            "message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "INVALID_REQUEST",
                            "message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "RESOURCE_NOT_FOUND",
                            "message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateCargoStatus(
            @PathVariable Long id,
            @RequestParam @NotBlank String status) {
        try {
            CargoStatus cargoStatus = CargoStatus.valueOf(status.toUpperCase());
            Cargo updatedCargo = cargoService.updateCargoStatus(id, cargoStatus);
            return ResponseEntity.ok(updatedCargo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(getInvalidStatusResponse(status));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "CARGO_NOT_FOUND",
                            "message", "Cargo not found with id: " + id));
        }
    }

    @PatchMapping("/{id}/weight")
    public ResponseEntity<?> updateCargoWeight(
            @PathVariable Long id,
            @RequestBody Map<String, Double> request) {
        try {
            double newWeight = request.get("weight");
            if (newWeight <= 0) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "INVALID_WEIGHT",
                        "message", "Weight must be positive"));
            }

            Cargo updatedCargo = cargoService.updateCargoWeight(id, newWeight);
            return ResponseEntity.ok(updatedCargo);
        } catch (InsufficientCargoCapacityException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "error", "INSUFFICIENT_CAPACITY",
                            "message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "CARGO_NOT_FOUND",
                            "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCargo(@PathVariable Long id) {
        try {
            cargoService.deleteCargo(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", "CARGO_NOT_FOUND",
                            "message", "Cargo not found with id: " + id));
        }
    }

  
    private Map<String, String> getInvalidStatusResponse(String invalidStatus) {
        String validStatuses = Arrays.stream(CargoStatus.values())
                .map(Enum::name)
                .collect(Collectors.joining(", "));

        return Map.of(
                "error", "INVALID_STATUS",
                "message", "Invalid status '" + invalidStatus + "'. Valid values are: " + validStatuses,
                "validStatuses", validStatuses);
    }
}