package rw.maritime.nvg.DTO;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PaymentResponseDTO {
    private Long id;
    private double amount;
    private String currency;
    private String paymentStatus;
    private String paymentMethod;
    private LocalDateTime paymentDate;
    private String clientSecret;
    private List<Long> ticketIds;
    private List<Long> cargoIds;
}