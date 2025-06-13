package rw.maritime.nvg.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "routes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String departurePort;

    @Column(nullable = false)
    private String destinationPort;

    private double distance;
}
