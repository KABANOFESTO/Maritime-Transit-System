package rw.maritime.nvg.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"vessel", "route", "tickets", "cargo"}) 
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "vessel_id")
    @JsonIgnoreProperties({"schedules", "hibernateLazyInitializer", "handler"}) 
    private Vessel vessel;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    @JsonIgnoreProperties({"schedules", "hibernateLazyInitializer", "handler"}) 
    private Route route;

    @Column(nullable = false)
    private LocalDateTime departureTime;

    @Column(nullable = false)
    private LocalDateTime arrivalTime;

    @Column(name = "total_seats", nullable = false)
    private int totalSeats;

    @Column(name = "total_cargo_capacity", nullable = false)
    private double totalCargoCapacity;

    @Column(name = "seat_price", nullable = false)
    private double seatPrice;  

    @Column(name = "cargo_price_per_kg", nullable = false)
    private double cargoPricePerKg;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"schedule", "hibernateLazyInitializer", "handler"})
    private List<Ticket> tickets;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"schedule", "hibernateLazyInitializer", "handler"})
    private List<Cargo> cargo;

    public int getBookedSeatsCount() {
        return tickets != null ? tickets.size() : 0;
    }

    public int getAvailableSeatsCount() {
        return totalSeats - getBookedSeatsCount();
    }

    public boolean hasAvailableSeats() {
        return getAvailableSeatsCount() > 0;
    }

    public double getBookedCargoWeight() {
        return cargo != null ? cargo.stream().mapToDouble(Cargo::getWeight).sum() : 0.0;
    }

    public double getAvailableCargoCapacity() {
        return totalCargoCapacity - getBookedCargoWeight();
    }

    public boolean hasAvailableCargoCapacity() {
        return getAvailableCargoCapacity() > 0;
    }

    public boolean canAccommodateCargo(double cargoWeight) {
        return getAvailableCargoCapacity() >= cargoWeight;
    }

    public boolean canAddCargo(double cargoWeight) {
        return (getBookedCargoWeight() + cargoWeight) <= totalCargoCapacity;
    }
}