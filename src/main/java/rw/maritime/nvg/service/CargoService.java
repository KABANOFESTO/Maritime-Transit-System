package rw.maritime.nvg.service;

import org.springframework.stereotype.Service;
import rw.maritime.nvg.model.*;
import rw.maritime.nvg.repository.CargoRepository;
import rw.maritime.nvg.repository.UserRepository;
import rw.maritime.nvg.repository.ScheduleRepository;
import rw.maritime.nvg.DTO.CargoRequest;
import rw.maritime.nvg.exception.InsufficientCargoCapacityException;

import java.util.ArrayList;
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

    /**
     * Create cargo with capacity validation and price calculation
     */
    public Cargo createCargo(CargoRequest request) throws InsufficientCargoCapacityException {
        // Validate weight
        if (request.getWeight() <= 0) {
            throw new IllegalArgumentException("Cargo weight must be positive");
        }

        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        // CAPACITY VALIDATION - Check if cargo can be accommodated
        if (!schedule.canAddCargo(request.getWeight())) {
            throw new InsufficientCargoCapacityException(
                    String.format("Insufficient cargo capacity for schedule %d. Available: %.2f kg, Requested: %.2f kg",
                            schedule.getId(), schedule.getAvailableCargoCapacity(), request.getWeight()));
        }

        // Calculate price based on weight and schedule's cargo price per kg
        double price = calculateCargoPrice(schedule, request.getWeight());

        // Generate unique tracking number
        String trackingNumber = "NGV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Cargo cargo = new Cargo();
        cargo.setOwner(owner);
        cargo.setDescription(request.getDescription());
        cargo.setWeight(request.getWeight());
        cargo.setPrice(price);
        cargo.setTrackingNumber(trackingNumber);
        cargo.setSchedule(schedule);
        cargo.setCurrentStatus("Registered");

        // Save the cargo first
        Cargo savedCargo = cargoRepository.save(cargo);

        // Add the cargo to the schedule's list - the weight will be calculated
        // automatically
        if (schedule.getCargo() == null) {
            schedule.setCargo(new ArrayList<>());
        }
        schedule.getCargo().add(savedCargo);
        scheduleRepository.save(schedule);

        return savedCargo;
    }

    /**
     * Calculate cargo price based on weight and schedule's price per kg
     */
    public double calculateCargoPrice(Schedule schedule, double weight) {
        return weight * schedule.getCargoPricePerKg();
    }

    /**
     * Get cargo price for a specific weight on a schedule
     */
    public double getCargoPrice(Long scheduleId, double weight) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        return calculateCargoPrice(schedule, weight);
    }

    /**
     * Check if cargo can be booked for a schedule
     */
    public boolean canBookCargo(Long scheduleId, double weight) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        return schedule.canAddCargo(weight);
    }

    /**
     * Get available cargo capacity for a schedule
     */
    public double getAvailableCargoCapacity(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        return schedule.getAvailableCargoCapacity();
    }

    /**
     * Get total cargo capacity for a schedule
     */
    public double getTotalCargoCapacity(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        return schedule.getTotalCargoCapacity();
    }

    /**
     * Get booked cargo weight for a schedule
     */
    public double getBookedCargoWeight(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        return schedule.getBookedCargoWeight();
    }

    /**
     * Get cargo utilization percentage for a schedule
     */
    public double getCargoUtilizationPercentage(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        if (schedule.getTotalCargoCapacity() == 0) {
            return 0.0;
        }

        return (schedule.getBookedCargoWeight() / schedule.getTotalCargoCapacity()) * 100;
    }

    /**
     * Update cargo status with additional validation
     */
    public Cargo updateCargoStatus(Long id, String status) {
        return cargoRepository.findById(id)
                .map(cargo -> {
                    cargo.setCurrentStatus(status);
                    return cargoRepository.save(cargo);
                })
                .orElseThrow(() -> new RuntimeException("Cargo not found"));
    }

    /**
     * Update cargo weight with capacity validation and price recalculation
     */
    public Cargo updateCargoWeight(Long id, double newWeight) throws InsufficientCargoCapacityException {
        if (newWeight <= 0) {
            throw new IllegalArgumentException("Cargo weight must be positive");
        }

        Cargo cargo = cargoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cargo not found"));

        Schedule schedule = cargo.getSchedule();
        double currentWeight = cargo.getWeight();
        double weightDifference = newWeight - currentWeight;

        // Check if the weight increase can be accommodated
        if (weightDifference > 0 && !schedule.canAddCargo(weightDifference)) {
            throw new InsufficientCargoCapacityException(
                    String.format(
                            "Cannot update cargo weight. Additional weight needed: %.2f kg, Available capacity: %.2f kg",
                            weightDifference, schedule.getAvailableCargoCapacity()));
        }

        // Recalculate price if weight changed
        if (weightDifference != 0) {
            double newPrice = calculateCargoPrice(schedule, newWeight);
            cargo.setPrice(newPrice);
        }

        cargo.setWeight(newWeight);
        return cargoRepository.save(cargo);
    }

    /**
     * Delete cargo
     */
    public void deleteCargo(Long id) {
        cargoRepository.deleteById(id);
    }

    /**
     * Get cargo capacity summary for a schedule
     */
    public CargoCapacitySummary getCargoCapacitySummary(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        return new CargoCapacitySummary(
                schedule.getTotalCargoCapacity(),
                schedule.getBookedCargoWeight(),
                schedule.getAvailableCargoCapacity(),
                getCargoUtilizationPercentage(scheduleId));
    }

    /**
     * Get cargo price summary for a specific weight on a schedule
     */
    public CargoPriceSummary getCargoPriceSummary(Long scheduleId, double weight) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        double pricePerKg = schedule.getCargoPricePerKg();
        double totalPrice = calculateCargoPrice(schedule, weight);

        return new CargoPriceSummary(pricePerKg, weight, totalPrice);
    }

    /**
     * Inner class for cargo capacity summary
     */
    public static class CargoCapacitySummary {
        private final double totalCapacity;
        private final double bookedWeight;
        private final double availableCapacity;
        private final double utilizationPercentage;

        public CargoCapacitySummary(double totalCapacity, double bookedWeight,
                double availableCapacity, double utilizationPercentage) {
            this.totalCapacity = totalCapacity;
            this.bookedWeight = bookedWeight;
            this.availableCapacity = availableCapacity;
            this.utilizationPercentage = utilizationPercentage;
        }

        // Getters
        public double getTotalCapacity() {
            return totalCapacity;
        }

        public double getBookedWeight() {
            return bookedWeight;
        }

        public double getAvailableCapacity() {
            return availableCapacity;
        }

        public double getUtilizationPercentage() {
            return utilizationPercentage;
        }
    }

    /**
     * Inner class for cargo price summary
     */
    public static class CargoPriceSummary {
        private final double pricePerKg;
        private final double weight;
        private final double totalPrice;

        public CargoPriceSummary(double pricePerKg, double weight, double totalPrice) {
            this.pricePerKg = pricePerKg;
            this.weight = weight;
            this.totalPrice = totalPrice;
        }

        // Getters
        public double getPricePerKg() {
            return pricePerKg;
        }

        public double getWeight() {
            return weight;
        }

        public double getTotalPrice() {
            return totalPrice;
        }
    }
}