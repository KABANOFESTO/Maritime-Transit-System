package rw.maritime.nvg.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ScheduleResponse {
    private Long id;
    private Long vesselId;
    private String vesselName;
    private Long routeId;
    private String routeName;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private int totalSeats;
    private int availableSeats;
    private double totalCargoCapacity;
    private double availableCargoCapacity;
    private double seatPrice;
    private double cargoPricePerKg;

    public ScheduleResponse(rw.maritime.nvg.model.Schedule schedule) {
        this.id = schedule.getId();
        this.vesselId = schedule.getVessel().getId();
        this.vesselName = schedule.getVessel().getName(); 
        this.routeId = schedule.getRoute().getId();
        this.departureTime = schedule.getDepartureTime();
        this.arrivalTime = schedule.getArrivalTime();
        this.totalSeats = schedule.getTotalSeats();
        this.availableSeats = schedule.getAvailableSeatsCount();
        this.totalCargoCapacity = schedule.getTotalCargoCapacity();
        this.availableCargoCapacity = schedule.getAvailableCargoCapacity();
        this.seatPrice = schedule.getSeatPrice();
        this.cargoPricePerKg = schedule.getCargoPricePerKg();
    }
}
