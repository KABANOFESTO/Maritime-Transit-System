package rw.maritime.nvg.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vessels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Vessel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String type;

    private int capacity;

    private double fuelLevel;
}
