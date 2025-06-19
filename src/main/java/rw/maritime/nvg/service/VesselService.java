package rw.maritime.nvg.service;

import org.springframework.stereotype.Service;
import rw.maritime.nvg.model.Vessel;
import rw.maritime.nvg.repository.VesselRepository;

import java.util.List;
import java.util.Optional;

@Service
public class VesselService {
    private final VesselRepository vesselRepository;

    public VesselService(VesselRepository vesselRepository) {
        this.vesselRepository = vesselRepository;
    }

    public List<Vessel> getAllVessels() {
        return vesselRepository.findAll();
    }

    public Optional<Vessel> getVesselById(Long id) {
        return vesselRepository.findById(id);
    }

    public Optional<Vessel> getVesselByName(String name) {
        return vesselRepository.findByName(name);
    }

    public List<Vessel> getVesselsByType(String type) {
        return vesselRepository.findByType(type);
    }

    public List<Vessel> getVesselsWithMinCapacity(int minCapacity) {
        return vesselRepository.findByCapacityGreaterThanEqual(minCapacity);
    }

    public List<Vessel> getVesselsWithLowFuel(double fuelThreshold) {
        return vesselRepository.findByFuelLevelLessThan(fuelThreshold);
    }

    // Add this new method to get vessels by status
    public List<Vessel> getVesselsByStatus(Vessel.Status status) {
        return vesselRepository.findByStatus(status);
    }

    public Vessel createVessel(Vessel vessel) {
        // Set default status if not provided
        if (vessel.getStatus() == null) {
            vessel.setStatus(Vessel.Status.ACTIVE);
        }
        return vesselRepository.save(vessel);
    }

    public Vessel updateVessel(Long id, Vessel updatedVessel) {
        return vesselRepository.findById(id)
                .map(vessel -> {
                    vessel.setName(updatedVessel.getName());
                    vessel.setType(updatedVessel.getType());
                    vessel.setCapacity(updatedVessel.getCapacity());
                    vessel.setFuelLevel(updatedVessel.getFuelLevel());
                    // Update status if provided
                    if (updatedVessel.getStatus() != null) {
                        vessel.setStatus(updatedVessel.getStatus());
                    }
                    return vesselRepository.save(vessel);
                })
                .orElseGet(() -> {
                    updatedVessel.setId(id);
                    // Set default status if not provided
                    if (updatedVessel.getStatus() == null) {
                        updatedVessel.setStatus(Vessel.Status.ACTIVE);
                    }
                    return vesselRepository.save(updatedVessel);
                });
    }

    public void deleteVessel(Long id) {
        vesselRepository.deleteById(id);
    }

    public boolean existsByName(String name) {
        return vesselRepository.findByName(name).isPresent();
    }

    // Additional method to update vessel status
    public Optional<Vessel> updateVesselStatus(Long id, Vessel.Status newStatus) {
        return vesselRepository.findById(id)
                .map(vessel -> {
                    vessel.setStatus(newStatus);
                    return vesselRepository.save(vessel);
                });
    }
}