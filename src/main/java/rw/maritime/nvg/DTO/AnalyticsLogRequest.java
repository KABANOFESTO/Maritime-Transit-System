package rw.maritime.nvg.DTO;

import java.time.LocalDate;

import lombok.Data;

@Data
public class AnalyticsLogRequest {
    private LocalDate date;
    private int ticketsSold;
    private double cargoWeight;
    private double fuelConsumed;
    private double revenue;
}
