package rw.maritime.nvg.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CargoStatus currentStatus;

    @Column(nullable = false)
    private double price;

    @OneToOne(mappedBy = "cargo", cascade = CascadeType.ALL)
    @JsonIgnore
    private CargoPayment cargoPayment;
}