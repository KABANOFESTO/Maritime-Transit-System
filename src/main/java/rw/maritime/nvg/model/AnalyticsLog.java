package rw.maritime.nvg.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "analytics_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AnalyticsLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private int ticketsSold;

    @Column(nullable = false)
    private double cargoWeight;

    @Column(nullable = false)
    private double fuelConsumed;

    @Column(nullable = false)
    private double revenue;
}
