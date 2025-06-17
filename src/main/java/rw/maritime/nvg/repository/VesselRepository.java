package rw.maritime.nvg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.maritime.nvg.model.Vessel;

import java.util.List;
import java.util.Optional;

@Repository
public interface VesselRepository extends JpaRepository<Vessel, Long> {
    Optional<Vessel> findByName(String name);
    List<Vessel> findByType(String type);
    List<Vessel> findByCapacityGreaterThanEqual(int minCapacity);
    List<Vessel> findByFuelLevelLessThan(double fuelThreshold);
}