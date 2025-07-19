package rw.maritime.nvg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.maritime.nvg.model.TicketPayment;

import java.util.List;

@Repository
public interface TicketPaymentRepository extends JpaRepository<TicketPayment, Long> {
    List<TicketPayment> findByPaymentId(Long paymentId);

    List<TicketPayment> findByTicketId(Long ticketId);
}