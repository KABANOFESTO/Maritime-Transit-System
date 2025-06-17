package rw.maritime.nvg.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"vessel", "route"}) // Exclude relationships from toString to prevent lazy loading issues
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "vessel_id")
    @JsonIgnoreProperties({"schedules", "hibernateLazyInitializer", "handler"}) // Prevent circular reference and lazy loading issues
    private Vessel vessel;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    @JsonIgnoreProperties({"schedules", "hibernateLazyInitializer", "handler"}) // Prevent circular reference and lazy loading issues
    private Route route;

    @Column(nullable = false)
    private LocalDateTime departureTime;

    @Column(nullable = false)
    private LocalDateTime arrivalTime;
}