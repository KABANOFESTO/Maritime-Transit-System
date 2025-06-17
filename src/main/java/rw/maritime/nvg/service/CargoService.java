package rw.maritime.nvg.service;

import org.springframework.stereotype.Service;
import rw.maritime.nvg.model.*;
import rw.maritime.nvg.repository.CargoRepository;
import rw.maritime.nvg.repository.UserRepository;
import rw.maritime.nvg.repository.ScheduleRepository;
import rw.maritime.nvg.DTO.CargoRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CargoService {
    private final CargoRepository cargoRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    public CargoService(CargoRepository cargoRepository,
                      UserRepository userRepository,
                      ScheduleRepository scheduleRepository) {
        this.cargoRepository = cargoRepository;
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<Cargo> getAllCargo() {
        return cargoRepository.findAll();
    }

    public Optional<Cargo> getCargoById(Long id) {
        return cargoRepository.findById(id);
    }

    public Optional<Cargo> getCargoByTrackingNumber(String trackingNumber) {
        return cargoRepository.findByTrackingNumber(trackingNumber);
    }

    public List<Cargo> getCargoByOwner(Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return cargoRepository.findByOwner(owner);
    }

    public List<Cargo> getCargoBySchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        return cargoRepository.findBySchedule(schedule);
    }

    public List<Cargo> getCargoByStatus(String status) {
        return cargoRepository.findByCurrentStatus(status);
    }

    public Cargo createCargo(CargoRequest request) {
        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        // Generate unique tracking number
        String trackingNumber = "NGV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Cargo cargo = new Cargo();
        cargo.setOwner(owner);
        cargo.setDescription(request.getDescription());
        cargo.setWeight(request.getWeight());
        cargo.setTrackingNumber(trackingNumber);
        cargo.setSchedule(schedule);
        cargo.setCurrentStatus("Registered");

        return cargoRepository.save(cargo);
    }

    public Cargo updateCargoStatus(Long id, String status) {
        return cargoRepository.findById(id)
                .map(cargo -> {
                    cargo.setCurrentStatus(status);
                    return cargoRepository.save(cargo);
                })
                .orElseThrow(() -> new RuntimeException("Cargo not found"));
    }

    public void deleteCargo(Long id) {
        cargoRepository.deleteById(id);
    }
}