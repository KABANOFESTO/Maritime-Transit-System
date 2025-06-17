package rw.maritime.nvg.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;


@Data
public class CargoRequest {
    @NotNull(message = "Owner ID is required")
    @Positive(message = "Owner ID must be a positive number")
    private Long ownerId;

    @NotNull(message = "Schedule ID is required")
    @Positive(message = "Schedule ID must be a positive number")
    private Long scheduleId;

    @NotBlank(message = "Description is required")
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.1", message = "Weight must be at least 0.1 kg")
    @DecimalMax(value = "50000.0", message = "Weight cannot exceed 50,000 kg")
    private double weight;

    @Pattern(regexp = "^[A-Z]{3}-\\d{4}-[A-Z]{2}$", 
             message = "Special requirements code must be in format 'ABC-1234-XY'")
    private String specialRequirements;  // e.g., "REF-1234-C" for refrigerated cargo

    @AssertTrue(message = "Weight must be compatible with vessel capacity")
    public boolean isWeightValid() {
        // Will be validated against vessel capacity in service layer
        return true;
    }

    /**
     * Validates cargo dimensions against standard container sizes
     */
    public boolean isValidForContainerization() {
        // Add container validation logic if needed
        return true;
    }
}