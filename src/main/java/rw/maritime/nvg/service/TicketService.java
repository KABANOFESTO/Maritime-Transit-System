package rw.maritime.nvg.service;

import org.springframework.stereotype.Service;
import rw.maritime.nvg.model.*;
import rw.maritime.nvg.repository.TicketRepository;
import rw.maritime.nvg.repository.UserRepository;
import rw.maritime.nvg.repository.ScheduleRepository;
import rw.maritime.nvg.DTO.TicketRequest;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;

    public TicketService(TicketRepository ticketRepository,
                        UserRepository userRepository,
                        ScheduleRepository scheduleRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public List<Ticket> getTicketsByPassenger(Long passengerId) {
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        return ticketRepository.findByPassenger(passenger);
    }

    public List<Ticket> getTicketsBySchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        return ticketRepository.findBySchedule(schedule);
    }

    public List<Ticket> getTicketsByPaymentStatus(boolean paid) {
        return ticketRepository.findByPaid(paid);
    }

    public Ticket createTicket(TicketRequest request) {
        User passenger = userRepository.findById(request.getPassengerId())
                .orElseThrow(() -> new RuntimeException("Passenger not found"));
        
        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Schedule not found"));

        // Check seat availability
        if (ticketRepository.existsByScheduleAndSeatNumber(schedule, request.getSeatNumber())) {
            throw new RuntimeException("Seat already booked for this schedule");
        }

        Ticket ticket = new Ticket();
        ticket.setPassenger(passenger);
        ticket.setSchedule(schedule);
        ticket.setSeatNumber(request.getSeatNumber());
        ticket.setPrice(request.getPrice());
        ticket.setPaid(request.isPaid());

        return ticketRepository.save(ticket);
    }

    public Ticket updateTicket(Long id, TicketRequest request) {
        return ticketRepository.findById(id)
                .map(ticket -> {
                    if (request.getSeatNumber() != null) {
                        // Check if new seat is available
                        if (ticketRepository.existsByScheduleAndSeatNumber(
                                ticket.getSchedule(), 
                                request.getSeatNumber())) {
                            throw new RuntimeException("Seat already booked");
                        }
                        ticket.setSeatNumber(request.getSeatNumber());
                    }
                    
                    if (request.getPrice() > 0) {
                        ticket.setPrice(request.getPrice());
                    }
                    
                    ticket.setPaid(request.isPaid());
                    return ticketRepository.save(ticket);
                })
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }
}