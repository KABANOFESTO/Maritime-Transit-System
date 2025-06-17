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

    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<List<Ticket>> getTicketsByPassenger(
            @PathVariable Long passengerId) {
        List<Ticket> tickets = ticketService.getTicketsByPassenger(passengerId);
        return tickets.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(tickets);
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
}