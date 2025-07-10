package rw.maritime.nvg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rw.maritime.nvg.model.Ticket;
import rw.maritime.nvg.model.Schedule;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    List<Ticket> findBySchedule(Schedule schedule);
    
    List<Ticket> findByScheduleId(Long scheduleId);
    
    List<Ticket> findByPaid(boolean paid);
    
    boolean existsByScheduleAndSeatNumber(Schedule schedule, String seatNumber);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.schedule.id = :scheduleId")
    int countByScheduleId(@Param("scheduleId") Long scheduleId);
    
    @Query("SELECT t.seatNumber FROM Ticket t WHERE t.schedule.id = :scheduleId")
    List<String> findSeatNumbersByScheduleId(@Param("scheduleId") Long scheduleId);
}