package rw.maritime.nvg.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class TicketRequest {
    @NotNull(message = "Passenger ID is required")
    @Positive(message = "Passenger ID must be a positive number")
    private Long passengerId;

    @NotNull(message = "Schedule ID is required")
    @Positive(message = "Schedule ID must be a positive number")
    private Long scheduleId;

    @NotBlank(message = "Seat number is required")
    @Pattern(regexp = "^[A-Za-z]\\d{1,3}$", 
             message = "Seat number must be in format 'A1' or 'B12'")
    private String seatNumber;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be at least 0.01")
    @DecimalMax(value = "10000.00", message = "Price cannot exceed 10,000.00")
    private double price;

    @NotNull(message = "Payment status must be specified")
    private boolean paid;

    /**
     * Validates seat number format based on vessel type (if available)
     * Could be enhanced with vessel-specific validation
     */
    public boolean isValidSeat() {
        // Basic validation already handled by @Pattern
        // Add vessel-specific validation logic here if needed
        return true;
    }
}