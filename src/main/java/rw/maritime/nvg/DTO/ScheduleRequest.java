package rw.maritime.nvg.DTO;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScheduleRequest {
    @NotNull(message = "Vessel ID is required")
    @Positive(message = "Vessel ID must be a positive number")
    private Long vesselId;

    @NotNull(message = "Route ID is required")
    @Positive(message = "Route ID must be a positive number")
    private Long routeId;

    @NotNull(message = "Departure time is required")
    @Future(message = "Departure time must be in the future")
    private LocalDateTime departureTime;

    @NotNull(message = "Arrival time is required")
    @Future(message = "Arrival time must be in the future")
    private LocalDateTime arrivalTime;

    @NotNull(message = "Total seats is required")
    @Positive(message = "Total seats must be a positive number")
    private Integer totalSeats;

    // Add these missing fields:
    @NotNull(message = "Total cargo capacity is required")
    @Positive(message = "Total cargo capacity must be a positive number")
    private Double totalCargoCapacity;

    @NotNull(message = "Seat price is required")
    @Positive(message = "Seat price must be a positive number")
    private Double seatPrice;

    @NotNull(message = "Cargo price per kg is required")
    @Positive(message = "Cargo price per kg must be a positive number")
    private Double cargoPricePerKg;

    public boolean isValidTimeRange() {
        return arrivalTime.isAfter(departureTime);
    }
}