package rw.maritime.nvg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.maritime.nvg.model.Ticket;
import rw.maritime.nvg.model.User;
import rw.maritime.nvg.model.Schedule;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByPassenger(User passenger);
    List<Ticket> findBySchedule(Schedule schedule);
    List<Ticket> findByPaid(boolean paid);
    boolean existsByScheduleAndSeatNumber(Schedule schedule, String seatNumber);
}