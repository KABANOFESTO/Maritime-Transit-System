package rw.maritime.nvg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.maritime.nvg.model.Cargo;
import rw.maritime.nvg.model.User;
import rw.maritime.nvg.model.Schedule;

import java.util.List;
import java.util.Optional;

@Repository
public interface CargoRepository extends JpaRepository<Cargo, Long> {
    List<Cargo> findByOwner(User owner);
    List<Cargo> findBySchedule(Schedule schedule);
    List<Cargo> findByCurrentStatus(String status);
    Optional<Cargo> findByTrackingNumber(String trackingNumber);
    boolean existsByTrackingNumber(String trackingNumber);
}