package rw.maritime.nvg.service;

import org.springframework.stereotype.Service;
import rw.maritime.nvg.model.*;
import rw.maritime.nvg.repository.ScheduleRepository;
import rw.maritime.nvg.repository.VesselRepository;
import rw.maritime.nvg.repository.RouteRepository;
import rw.maritime.nvg.DTO.ScheduleRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final VesselRepository vesselRepository;
    private final RouteRepository routeRepository;

    public ScheduleService(ScheduleRepository scheduleRepository,
            VesselRepository vesselRepository,
            RouteRepository routeRepository) {
        this.scheduleRepository = scheduleRepository;
        this.vesselRepository = vesselRepository;
        this.routeRepository = routeRepository;
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Optional<Schedule> getScheduleById(Long id) {
        return scheduleRepository.findById(id);
    }

    public List<Schedule> getSchedulesByVessel(Long vesselId) {
        return scheduleRepository.findByVesselId(vesselId);
    }

    public List<Schedule> getSchedulesByRoute(Long routeId) {
        return scheduleRepository.findByRouteId(routeId);
    }

    public List<Schedule> getSchedulesByDepartureWindow(LocalDateTime start, LocalDateTime end) {
        return scheduleRepository.findByDepartureTimeBetween(start, end);
    }

    public List<Schedule> getSchedulesByArrivalWindow(LocalDateTime start, LocalDateTime end) {
        return scheduleRepository.findByArrivalTimeBetween(start, end);
    }

    public Schedule createSchedule(ScheduleRequest request) {
        Vessel vessel = vesselRepository.findById(request.getVesselId())
                .orElseThrow(() -> new RuntimeException("Vessel not found"));

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        // Check for vessel availability
        if (scheduleRepository.existsByVesselAndDepartureTimeBetween(
                vessel,
                request.getDepartureTime().minusHours(1),
                request.getArrivalTime().plusHours(1))) {
            throw new RuntimeException("Vessel is already scheduled during this time");
        }

        Schedule schedule = new Schedule();
        schedule.setVessel(vessel);
        schedule.setRoute(route);
        schedule.setDepartureTime(request.getDepartureTime());
        schedule.setArrivalTime(request.getArrivalTime());
        schedule.setTotalSeats(request.getTotalSeats());
        schedule.setTotalCargoCapacity(request.getTotalCargoCapacity());
        schedule.setSeatPrice(request.getSeatPrice());
        schedule.setCargoPricePerKg(request.getCargoPricePerKg());

        return scheduleRepository.save(schedule);
    }

    public Schedule updateSchedule(Long id, ScheduleRequest request) {
        return scheduleRepository.findById(id)
                .map(schedule -> {
                    Vessel vessel = vesselRepository.findById(request.getVesselId())
                            .orElseThrow(() -> new RuntimeException("Vessel not found"));

                    Route route = routeRepository.findById(request.getRouteId())
                            .orElseThrow(() -> new RuntimeException("Route not found"));

                    schedule.setVessel(vessel);
                    schedule.setRoute(route);
                    schedule.setDepartureTime(request.getDepartureTime());
                    schedule.setArrivalTime(request.getArrivalTime());
                    schedule.setTotalSeats(request.getTotalSeats());
                    schedule.setTotalCargoCapacity(request.getTotalCargoCapacity());
                    schedule.setSeatPrice(request.getSeatPrice());
                    schedule.setCargoPricePerKg(request.getCargoPricePerKg());

                    return scheduleRepository.save(schedule);
                })
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }
}