package rw.maritime.nvg.DTO;
import lombok.Data;
import java.time.LocalDate;

@Data
public class InventoryRequest {
    private Long vesselId;
    private LocalDate lastMaintenance;
    private String maintenanceNotes;
    private int crewCount;

     public LocalDate getLastMaintenance() {
        return lastMaintenance;
    }

    public void setLastMaintenance(LocalDate lastMaintenance) {
        this.lastMaintenance = lastMaintenance;
    }
}
