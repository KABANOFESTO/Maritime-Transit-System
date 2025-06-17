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

    public Vessel createVessel(Vessel vessel) {
        return vesselRepository.save(vessel);
    }

    public Vessel updateVessel(Long id, Vessel updatedVessel) {
        return vesselRepository.findById(id)
                .map(vessel -> {
                    vessel.setName(updatedVessel.getName());
                    vessel.setType(updatedVessel.getType());
                    vessel.setCapacity(updatedVessel.getCapacity());
                    vessel.setFuelLevel(updatedVessel.getFuelLevel());
                    return vesselRepository.save(vessel);
                })
                .orElseGet(() -> {
                    updatedVessel.setId(id);
                    return vesselRepository.save(updatedVessel);
                });
    }

    public void deleteVessel(Long id) {
        vesselRepository.deleteById(id);
    }

    public boolean existsByName(String name) {
        return vesselRepository.findByName(name).isPresent();
    }
}