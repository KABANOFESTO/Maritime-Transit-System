package rw.maritime.nvg.DTO;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PaymentRequestDTO {
    private Long userId;
    private List<Long> ticketIds;
    private List<Long> cargoIds;
    private String paymentMethod; 
    private String currency; 
}