package rw.maritime.nvg.service;

import org.springframework.stereotype.Service;
import rw.maritime.nvg.model.Route;
import rw.maritime.nvg.repository.RouteRepository;

import java.util.List;
import java.util.Optional;

@Service
public class RouteService {
    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Optional<Route> getRouteById(Long id) {
        return routeRepository.findById(id);
    }

    public List<Route> getRoutesByDeparturePort(String departurePort) {
        return routeRepository.findByDeparturePort(departurePort);
    }

    public List<Route> getRoutesByDestinationPort(String destinationPort) {
        return routeRepository.findByDestinationPort(destinationPort);
    }

    public Optional<Route> getRouteByPorts(String departurePort, String destinationPort) {
        return routeRepository.findByDeparturePortAndDestinationPort(departurePort, destinationPort);
    }

    public Route createRoute(Route route) {
        return routeRepository.save(route);
    }

    public Route updateRoute(Long id, Route updatedRoute) {
        return routeRepository.findById(id)
                .map(route -> {
                    route.setDeparturePort(updatedRoute.getDeparturePort());
                    route.setDestinationPort(updatedRoute.getDestinationPort());
                    route.setDistance(updatedRoute.getDistance());
                    return routeRepository.save(route);
                })
                .orElseGet(() -> {
                    updatedRoute.setId(id);
                    return routeRepository.save(updatedRoute);
                });
    }

    public void deleteRoute(Long id) {
        routeRepository.deleteById(id);
    }

    public boolean existsByPorts(String departurePort, String destinationPort) {
        return routeRepository.findByDeparturePortAndDestinationPort(departurePort, destinationPort).isPresent();
    }
}