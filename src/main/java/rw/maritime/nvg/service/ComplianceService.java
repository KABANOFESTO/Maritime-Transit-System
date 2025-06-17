package rw.maritime.nvg.service;

import org.springframework.stereotype.Service;
import rw.maritime.nvg.model.*;
import rw.maritime.nvg.repository.ComplianceRepository;
import rw.maritime.nvg.repository.VesselRepository;
import rw.maritime.nvg.DTO.ComplianceRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ComplianceService {
    private final ComplianceRepository complianceRepository;
    private final VesselRepository vesselRepository;

    public ComplianceService(ComplianceRepository complianceRepository,
                           VesselRepository vesselRepository) {
        this.complianceRepository = complianceRepository;
        this.vesselRepository = vesselRepository;
    }

    public List<Compliance> getAllComplianceRecords() {
        return complianceRepository.findAll();
    }

    public Optional<Compliance> getComplianceById(Long id) {
        return complianceRepository.findById(id);
    }

    public Optional<Compliance> getComplianceByVessel(Long vesselId) {
        Vessel vessel = vesselRepository.findById(vesselId)
                .orElseThrow(() -> new RuntimeException("Vessel not found"));
        return complianceRepository.findByVessel(vessel);
    }

    public List<Compliance> getVesselsWithSafetyChecks(boolean passed) {
        return complianceRepository.findBySafetyCheckPassed(passed);
    }

    public List<Compliance> getVesselsWithDocumentation(boolean complete) {
        return complianceRepository.findByRegulatoryDocumentsComplete(complete);
    }

    public List<Compliance> getVesselsDueForInspection() {
        return complianceRepository.findByLastInspectionDateBefore(
            LocalDate.now().minusMonths(6) // Assuming inspections every 6 months
        );
    }

    public Compliance createComplianceRecord(ComplianceRequest request) {
        Vessel vessel = vesselRepository.findById(request.getVesselId())
                .orElseThrow(() -> new RuntimeException("Vessel not found"));

        if (complianceRepository.findByVessel(vessel).isPresent()) {
            throw new RuntimeException("Compliance record already exists for this vessel");
        }

        Compliance compliance = new Compliance();
        compliance.setVessel(vessel);
        compliance.setSafetyCheckPassed(request.isSafetyCheckPassed());
        compliance.setRegulatoryDocumentsComplete(request.isRegulatoryDocumentsComplete());
        compliance.setLastInspectionDate(request.getLastInspectionDate());

        return complianceRepository.save(compliance);
    }

    public Compliance updateCompliance(Long id, ComplianceRequest request) {
        return complianceRepository.findById(id)
                .map(record -> {
                    record.setSafetyCheckPassed(request.isSafetyCheckPassed());
                    record.setRegulatoryDocumentsComplete(request.isRegulatoryDocumentsComplete());
                    record.setLastInspectionDate(request.getLastInspectionDate());
                    return complianceRepository.save(record);
                })
                .orElseThrow(() -> new RuntimeException("Compliance record not found"));
    }

    public void deleteCompliance(Long id) {
        complianceRepository.deleteById(id);
    }
}