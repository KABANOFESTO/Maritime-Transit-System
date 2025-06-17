package rw.maritime.nvg.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rw.maritime.nvg.model.Vessel;
import rw.maritime.nvg.service.VesselService;

import java.util.List;

@RestController
@RequestMapping("/api/vessels")
public class VesselController {
    private final VesselService vesselService;

    public VesselController(VesselService vesselService) {
        this.vesselService = vesselService;
    }

    @GetMapping
    public ResponseEntity<List<Vessel>> getAllVessels() {
        return ResponseEntity.ok(vesselService.getAllVessels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vessel> getVesselById(@PathVariable Long id) {
        return vesselService.getVesselById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Vessel> getVesselByName(@PathVariable String name) {
        return vesselService.getVesselByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Vessel>> getVesselsByType(@PathVariable String type) {
        return ResponseEntity.ok(vesselService.getVesselsByType(type));
    }

    @GetMapping("/capacity/{minCapacity}")
    public ResponseEntity<List<Vessel>> getVesselsWithMinCapacity(@PathVariable int minCapacity) {
        return ResponseEntity.ok(vesselService.getVesselsWithMinCapacity(minCapacity));
    }

    @GetMapping("/low-fuel/{fuelThreshold}")
    public ResponseEntity<List<Vessel>> getVesselsWithLowFuel(@PathVariable double fuelThreshold) {
        return ResponseEntity.ok(vesselService.getVesselsWithLowFuel(fuelThreshold));
    }

    @PostMapping
    public ResponseEntity<Vessel> createVessel(@RequestBody Vessel vessel) {
        if (vesselService.existsByName(vessel.getName())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(vesselService.createVessel(vessel));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vessel> updateVessel(@PathVariable Long id, @RequestBody Vessel vessel) {
        return ResponseEntity.ok(vesselService.updateVessel(id, vessel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVessel(@PathVariable Long id) {
        vesselService.deleteVessel(id);
        return ResponseEntity.noContent().build();
    }
}