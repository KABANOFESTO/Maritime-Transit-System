package rw.maritime.nvg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.maritime.nvg.model.AnalyticsLog;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnalyticsLogRepository extends JpaRepository<AnalyticsLog, Long> {
    Optional<AnalyticsLog> findByDate(LocalDate date);
    List<AnalyticsLog> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<AnalyticsLog> findByRevenueGreaterThan(double minRevenue);
}