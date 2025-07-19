package rw.maritime.nvg.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @Column(nullable = false)
    private String seatNumber;

    @Column(nullable = false)
    private boolean paid;

    @OneToOne(mappedBy = "ticket", cascade = CascadeType.ALL)
    @JsonIgnore 
    private TicketPayment ticketPayment;
}