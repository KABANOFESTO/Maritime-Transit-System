package rw.maritime.nvg.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "compliance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Compliance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "vessel_id", unique = true)
    private Vessel vessel;

    @Column(nullable = false)
    private boolean safetyCheckPassed;

    @Column(nullable = false)
    private boolean regulatoryDocumentsComplete;

    @Column(nullable = false)
    private LocalDate lastInspectionDate;
}
