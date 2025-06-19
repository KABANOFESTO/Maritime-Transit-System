package rw.maritime.nvg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.maritime.nvg.model.Vessel;
import rw.maritime.nvg.model.Vessel.Status;

import java.util.List;
import java.util.Optional;

@Repository
public interface VesselRepository extends JpaRepository<Vessel, Long> {
    Optional<Vessel> findByName(String name);
    List<Vessel> findByType(String type);
    List<Vessel> findByCapacityGreaterThanEqual(int minCapacity);
    List<Vessel> findByFuelLevelLessThan(double fuelThreshold);
    
    // Optional additional methods for status queries:
    List<Vessel> findByStatus(Status status);
    List<Vessel> findByStatusAndType(Status status, String type);
    List<Vessel> findByStatusAndCapacityGreaterThanEqual(Status status, int minCapacity);
}