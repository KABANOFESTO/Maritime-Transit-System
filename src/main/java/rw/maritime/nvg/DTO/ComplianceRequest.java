package rw.maritime.nvg.DTO;
import lombok.Data;
import java.time.LocalDate;

    @Data
    public class ComplianceRequest {
        private Long vesselId;
        private boolean safetyCheckPassed;
        private boolean regulatoryDocumentsComplete;
        private LocalDate lastInspectionDate;
    }
