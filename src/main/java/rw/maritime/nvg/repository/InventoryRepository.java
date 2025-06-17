package rw.maritime.nvg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.maritime.nvg.model.Inventory;
import rw.maritime.nvg.model.Vessel;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByVessel(Vessel vessel);
    List<Inventory> findByLastMaintenanceBefore(LocalDate date);
    List<Inventory> findByCrewCountLessThan(int minCrewCount);
    boolean existsByVessel(Vessel vessel);
}