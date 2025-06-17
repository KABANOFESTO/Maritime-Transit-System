package rw.maritime.nvg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.maritime.nvg.model.Route;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findByDeparturePortAndDestinationPort(String departurePort, String destinationPort);
    List<Route> findByDeparturePort(String departurePort);
    List<Route> findByDestinationPort(String destinationPort);
}