package rw.maritime.nvg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.maritime.nvg.model.Compliance;
import rw.maritime.nvg.model.Vessel;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplianceRepository extends JpaRepository<Compliance, Long> {
    Optional<Compliance> findByVessel(Vessel vessel);
    List<Compliance> findBySafetyCheckPassed(boolean passed);
    List<Compliance> findByRegulatoryDocumentsComplete(boolean complete);
    List<Compliance> findByLastInspectionDateBefore(LocalDate date);
}
