package rw.maritime.nvg.service;

import org.springframework.stereotype.Service;
import rw.maritime.nvg.model.*;
import rw.maritime.nvg.repository.InventoryRepository;
import rw.maritime.nvg.repository.VesselRepository;
import rw.maritime.nvg.DTO.InventoryRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final VesselRepository vesselRepository;

    public InventoryService(InventoryRepository inventoryRepository,
                          VesselRepository vesselRepository) {
        this.inventoryRepository = inventoryRepository;
        this.vesselRepository = vesselRepository;
    }

    public List<Inventory> getAllInventories() {
        return inventoryRepository.findAll();
    }

    public Optional<Inventory> getInventoryById(Long id) {
        return inventoryRepository.findById(id);
    }

    public Optional<Inventory> getInventoryByVessel(Long vesselId) {
        Vessel vessel = vesselRepository.findById(vesselId)
                .orElseThrow(() -> new RuntimeException("Vessel not found"));
        return inventoryRepository.findByVessel(vessel);
    }

    public List<Inventory> getVesselsDueForMaintenance() {
        return inventoryRepository.findByLastMaintenanceBefore(LocalDate.now().minusMonths(6));
    }

    public List<Inventory> getUnderstaffedVessels(int minCrewCount) {
        return inventoryRepository.findByCrewCountLessThan(minCrewCount);
    }

    public Inventory createInventory(InventoryRequest request) {
        Vessel vessel = vesselRepository.findById(request.getVesselId())
                .orElseThrow(() -> new RuntimeException("Vessel not found"));

        if (inventoryRepository.existsByVessel(vessel)) {
            throw new RuntimeException("Inventory already exists for this vessel");
        }

        Inventory inventory = new Inventory();
        inventory.setVessel(vessel);
        inventory.setLastMaintenance(request.getLastMaintenance());
        inventory.setMaintenanceNotes(request.getMaintenanceNotes());
        inventory.setCrewCount(request.getCrewCount());

        return inventoryRepository.save(inventory);
    }

    public Inventory updateInventory(Long id, InventoryRequest request) {
        return inventoryRepository.findById(id)
                .map(inventory -> {
                    if (request.getLastMaintenance() != null) {
                        inventory.setLastMaintenance(request.getLastMaintenance());
                    }
                    if (request.getMaintenanceNotes() != null) {
                        inventory.setMaintenanceNotes(request.getMaintenanceNotes());
                    }
                    if (request.getCrewCount() > 0) {
                        inventory.setCrewCount(request.getCrewCount());
                    }
                    return inventoryRepository.save(inventory);
                })
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
    }

    public void deleteInventory(Long id) {
        inventoryRepository.deleteById(id);
    }
}