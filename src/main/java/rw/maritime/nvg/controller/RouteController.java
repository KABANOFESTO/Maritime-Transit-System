package rw.maritime.nvg.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.maritime.nvg.model.Route;
import rw.maritime.nvg.service.RouteService;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {
    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Route> getRouteById(@PathVariable Long id) {
        return routeService.getRouteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/departure/{departurePort}")
    public ResponseEntity<List<Route>> getRoutesByDeparturePort(@PathVariable String departurePort) {
        return ResponseEntity.ok(routeService.getRoutesByDeparturePort(departurePort));
    }

    @GetMapping("/destination/{destinationPort}")
    public ResponseEntity<List<Route>> getRoutesByDestinationPort(@PathVariable String destinationPort) {
        return ResponseEntity.ok(routeService.getRoutesByDestinationPort(destinationPort));
    }

    @GetMapping("/search")
    public ResponseEntity<Route> getRouteByPorts(
            @RequestParam String departurePort,
            @RequestParam String destinationPort) {
        return routeService.getRouteByPorts(departurePort, destinationPort)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Route> createRoute(@RequestBody Route route) {
        if (routeService.existsByPorts(route.getDeparturePort(), route.getDestinationPort())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(routeService.createRoute(route));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Route> updateRoute(@PathVariable Long id, @RequestBody Route route) {
        return ResponseEntity.ok(routeService.updateRoute(id, route));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ResponseEntity.noContent().build();
    }
}