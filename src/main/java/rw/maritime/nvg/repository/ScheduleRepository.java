package rw.maritime.nvg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.maritime.nvg.model.Schedule;
import rw.maritime.nvg.model.Vessel;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByVesselId(Long vesselId);

    List<Schedule> findByRouteId(Long routeId);

    List<Schedule> findByDepartureTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Schedule> findByArrivalTimeBetween(LocalDateTime start, LocalDateTime end);

    boolean existsByVesselAndDepartureTimeBetween(Vessel vessel, LocalDateTime start, LocalDateTime end);
}