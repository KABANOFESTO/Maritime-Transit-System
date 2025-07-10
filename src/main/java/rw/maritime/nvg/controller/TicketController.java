package rw.maritime.nvg.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import rw.maritime.nvg.DTO.TicketRequest;
import rw.maritime.nvg.exception.ResourceNotFoundException;
import rw.maritime.nvg.exception.ValidationException;
import rw.maritime.nvg.model.Ticket;
import rw.maritime.nvg.service.TicketService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        List<Ticket> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<List<Ticket>> getTicketsBySchedule(
            @PathVariable Long scheduleId) {
        List<Ticket> tickets = ticketService.getTicketsBySchedule(scheduleId);
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    @GetMapping("/status/{paid}")
    public ResponseEntity<List<Ticket>> getTicketsByPaymentStatus(
            @PathVariable boolean paid) {
        List<Ticket> tickets = ticketService.getTicketsByPaymentStatus(paid);
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(
            @Valid @RequestBody TicketRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult.getFieldErrors());
        }

        Ticket createdTicket = ticketService.createTicket(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable Long id,
            @Valid @RequestBody TicketRequest request,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult.getFieldErrors());
        }

        return ResponseEntity.ok(ticketService.updateTicket(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    // NEW: Seat management endpoints
    @GetMapping("/schedule/{scheduleId}/seats/info")
    public ResponseEntity<Map<String, Object>> getSeatsInfo(@PathVariable Long scheduleId) {
        Map<String, Object> seatsInfo = new HashMap<>();
        seatsInfo.put("totalSeats", ticketService.getTotalSeats(scheduleId));
        seatsInfo.put("bookedSeats", ticketService.getBookedSeatsCount(scheduleId));
        seatsInfo.put("availableSeats", ticketService.getAvailableSeatsCount(scheduleId));
        seatsInfo.put("bookedSeatNumbers", ticketService.getBookedSeats(scheduleId));

        return ResponseEntity.ok(seatsInfo);
    }

    @GetMapping("/schedule/{scheduleId}/seats/booked")
    public ResponseEntity<List<String>> getBookedSeats(@PathVariable Long scheduleId) {
        List<String> bookedSeats = ticketService.getBookedSeats(scheduleId);
        return ResponseEntity.ok(bookedSeats);
    }

    @GetMapping("/schedule/{scheduleId}/seats/available")
    public ResponseEntity<Integer> getAvailableSeatsCount(@PathVariable Long scheduleId) {
        int availableSeats = ticketService.getAvailableSeatsCount(scheduleId);
        return ResponseEntity.ok(availableSeats);
    }

    @GetMapping("/schedule/{scheduleId}/seats/{seatNumber}/available")
    public ResponseEntity<Map<String, Boolean>> checkSeatAvailability(
            @PathVariable Long scheduleId,
            @PathVariable String seatNumber) {
        boolean available = ticketService.isSeatAvailable(scheduleId, seatNumber);
        Map<String, Boolean> response = new HashMap<>();
        response.put("available", available);
        return ResponseEntity.ok(response);
    }
}