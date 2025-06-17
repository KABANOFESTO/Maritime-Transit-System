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

    /**
     * Validates that arrival time is after departure time
     */
    public boolean isValidTimeRange() {
        return arrivalTime.isAfter(departureTime);
    }
}