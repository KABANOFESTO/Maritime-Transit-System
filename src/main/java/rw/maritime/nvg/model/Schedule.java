package rw.maritime.nvg.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vessel_id")
    private Vessel vessel;

    @ManyToOne(optional = false)
    @JoinColumn(name = "route_id")
    private Route route;

    @Column(nullable = false)
    private LocalDateTime departureTime;

    @Column(nullable = false)
    private LocalDateTime arrivalTime;
}
