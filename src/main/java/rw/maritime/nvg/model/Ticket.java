package rw.maritime.nvg.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "passenger_id")
    private User passenger;

    @ManyToOne(optional = false)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @Column(nullable = false)
    private String seatNumber;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private boolean paid;
}
