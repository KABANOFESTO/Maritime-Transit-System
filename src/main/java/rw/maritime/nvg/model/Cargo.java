package rw.maritime.nvg.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cargo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Cargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private double weight;

    @Column(nullable = false, unique = true)
    private String trackingNumber;

    @ManyToOne(optional = false)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @Column(nullable = false)
    private String currentStatus; // e.g., "In Transit", "Delivered"
}
