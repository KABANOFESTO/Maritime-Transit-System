package rw.maritime.nvg.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = { "ticketPayments", "cargoPayments" }) // Exclude collections from toString
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private String currency;

    @Column(nullable = false)
    private String paymentStatus;

    @Column(nullable = false)
    private String paymentMethod;

    @Column(nullable = false)
    private LocalDateTime paymentDate;

    @Column(nullable = false, unique = true)
    private String stripePaymentIntentId;

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("payment-ticketPayments") 
    private List<TicketPayment> ticketPayments = new ArrayList<>();

    @OneToMany(mappedBy = "payment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("payment-cargoPayments") 
    private List<CargoPayment> cargoPayments = new ArrayList<>();

    public void addTicketPayment(TicketPayment ticketPayment) {
        ticketPayments.add(ticketPayment);
        ticketPayment.setPayment(this);
    }

    public void addCargoPayment(CargoPayment cargoPayment) {
        cargoPayments.add(cargoPayment);
        cargoPayment.setPayment(this);
    }
}