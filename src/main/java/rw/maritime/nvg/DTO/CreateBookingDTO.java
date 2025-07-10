package rw.maritime.nvg.DTO;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class CreateBookingDTO {

    @NotNull(message = "Ticket ID is required")
    @Positive(message = "Ticket ID must be positive")
    private Long ticketId;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total amount must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Total amount must have at most 2 decimal places")
    private Double totalAmount;

    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;

    public boolean isValidAmount() {
        return totalAmount != null && totalAmount > 0;
    }

    public boolean hasNotes() {
        return notes != null && !notes.trim().isEmpty();
    }
}