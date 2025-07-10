package rw.maritime.nvg.service;

import org.springframework.stereotype.Service;
import rw.maritime.nvg.model.AnalyticsLog;
import rw.maritime.nvg.repository.AnalyticsLogRepository;
import rw.maritime.nvg.DTO.AnalyticsLogRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AnalyticsLogService {
    private final AnalyticsLogRepository analyticsLogRepository;

    public AnalyticsLogService(AnalyticsLogRepository analyticsLogRepository) {
        this.analyticsLogRepository = analyticsLogRepository;
    }

    public List<AnalyticsLog> getAllAnalyticsLogs() {
        return analyticsLogRepository.findAll();
    }

    public Optional<AnalyticsLog> getAnalyticsLogById(Long id) {
        return analyticsLogRepository.findById(id);
    }

    public Optional<AnalyticsLog> getAnalyticsLogByDate(LocalDate date) {
        return analyticsLogRepository.findByDate(date);
    }

    public List<AnalyticsLog> getAnalyticsLogsByDateRange(LocalDate startDate, LocalDate endDate) {
        return analyticsLogRepository.findByDateBetween(startDate, endDate);
    }

    public List<AnalyticsLog> getHighRevenueLogs(double minRevenue) {
        return analyticsLogRepository.findByRevenueGreaterThan(minRevenue);
    }

    public AnalyticsLog createAnalyticsLog(AnalyticsLogRequest request) {
    
        if (analyticsLogRepository.findByDate(request.getDate()).isPresent()) {
            throw new RuntimeException("Analytics log already exists for this date");
        }

        AnalyticsLog log = new AnalyticsLog();
        log.setDate(request.getDate());
        log.setTicketsSold(request.getTicketsSold());
        log.setCargoWeight(request.getCargoWeight());
        log.setFuelConsumed(request.getFuelConsumed());
        log.setRevenue(request.getRevenue());

        return analyticsLogRepository.save(log);
    }

    public AnalyticsLog updateAnalyticsLog(Long id, AnalyticsLogRequest request) {
        return analyticsLogRepository.findById(id)
                .map(log -> {
                    log.setTicketsSold(request.getTicketsSold());
                    log.setCargoWeight(request.getCargoWeight());
                    log.setFuelConsumed(request.getFuelConsumed());
                    log.setRevenue(request.getRevenue());
                    return analyticsLogRepository.save(log);
                })
                .orElseThrow(() -> new RuntimeException("Analytics log not found"));
    }

    public void deleteAnalyticsLog(Long id) {
        analyticsLogRepository.deleteById(id);
    }
}