package rw.maritime.nvg.DTO;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TicketRequest {
    
    @NotNull(message = "Schedule ID is required")
    @Positive(message = "Schedule ID must be positive")
    private Long scheduleId;
    
    @NotBlank(message = "Seat number is required")
    @Size(min = 1, max = 10, message = "Seat number must be between 1 and 10 characters")
    private String seatNumber;
    
    @NotNull(message = "Paid status is required")
    private Boolean paid;
    
    // Getter methods for boolean field
    public boolean isPaid() {
        return paid != null ? paid : false;
    }
    
    public Boolean getPaid() {
        return paid;
    }
}