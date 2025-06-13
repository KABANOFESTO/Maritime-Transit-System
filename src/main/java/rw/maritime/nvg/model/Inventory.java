package rw.maritime.nvg.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "vessel_id", unique = true)
    private Vessel vessel;

    @Column(name = "last_maintenance")
    private LocalDate lastMaintenance;

    @Column(length = 500)
    private String maintenanceNotes;

    @Column(name = "crew_count")
    private int crewCount;
}
