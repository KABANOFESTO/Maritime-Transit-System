package rw.maritime.nvg.DTO;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ComplaintRequest {
    private Long userId;

    @NotBlank(message = "Subject is mandatory")
    private String subject;

    @NotBlank(message = "Message is mandatory")
    private String message;
}
