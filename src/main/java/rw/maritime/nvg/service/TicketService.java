package rw.maritime.nvg.service;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import rw.maritime.nvg.model.*;
import rw.maritime.nvg.repository.TicketRepository;
import rw.maritime.nvg.repository.ScheduleRepository;
import rw.maritime.nvg.DTO.TicketRequest;
import rw.maritime.nvg.exception.ValidationException;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {
    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);
    
    private final TicketRepository ticketRepository;
    private final ScheduleRepository scheduleRepository;

    public TicketService(TicketRepository ticketRepository,
            ScheduleRepository scheduleRepository) {
        this.ticketRepository = ticketRepository;
        this.scheduleRepository = scheduleRepository;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public List<Ticket> getTicketsBySchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ValidationException("Schedule not found with ID: " + scheduleId));
        return ticketRepository.findBySchedule(schedule);
    }

    public List<Ticket> getTicketsByPaymentStatus(boolean paid) {
        return ticketRepository.findByPaid(paid);
    }

    public Ticket createTicket(TicketRequest request) {
        try {
            logger.info("Creating ticket for request: {}", request);
            
            if (request == null) {
                throw new ValidationException("Ticket request cannot be null");
            }
            
            if (request.getScheduleId() == null) {
                throw new ValidationException("Schedule ID is required");
            }
            
            if (request.getSeatNumber() == null || request.getSeatNumber().trim().isEmpty()) {
                throw new ValidationException("Seat number is required");
            }
            
            Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                    .orElseThrow(() -> new ValidationException("Schedule not found with ID: " + request.getScheduleId()));

            if (ticketRepository.existsByScheduleAndSeatNumber(schedule, request.getSeatNumber())) {
                throw new ValidationException("Seat " + request.getSeatNumber() + " is already booked for this schedule");
            }

            try {
                int totalSeats = getTotalSeatsFromSchedule(schedule);
                int bookedSeats = getBookedSeatsCountForSchedule(schedule);
                
                if (bookedSeats >= totalSeats) {
                    throw new ValidationException("No seats available for this schedule");
                }
            } catch (Exception e) {
                logger.warn("Could not check seat capacity, proceeding with booking: {}", e.getMessage());
            }

            Ticket ticket = new Ticket();
            ticket.setSchedule(schedule);
            ticket.setSeatNumber(request.getSeatNumber());
            ticket.setPaid(request.isPaid()); // Use isPaid() method

            logger.info("Saving ticket: {}", ticket);
            return ticketRepository.save(ticket);
            
        } catch (ValidationException e) {
            logger.error("Validation error creating ticket: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error creating ticket", e);
            throw new ValidationException("Error creating ticket: " + e.getMessage());
        }
    }

    public Ticket updateTicket(Long id, TicketRequest request) {
        return ticketRepository.findById(id)
                .map(ticket -> {
                    if (request.getSeatNumber() != null && !request.getSeatNumber().equals(ticket.getSeatNumber())) {
                        if (ticketRepository.existsByScheduleAndSeatNumber(
                                ticket.getSchedule(),
                                request.getSeatNumber())) {
                            throw new ValidationException("Seat " + request.getSeatNumber() + " is already booked");
                        }
                        ticket.setSeatNumber(request.getSeatNumber());
                    }

                    ticket.setPaid(request.isPaid());
                    
                    return ticketRepository.save(ticket);
                })
                .orElseThrow(() -> new ValidationException("Ticket not found with ID: " + id));
    }

    public void deleteTicket(Long id) {
        if (!ticketRepository.existsById(id)) {
            throw new ValidationException("Ticket not found with ID: " + id);
        }
        ticketRepository.deleteById(id);
    }
  
    public int getTotalSeats(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ValidationException("Schedule not found with ID: " + scheduleId));
        return getTotalSeatsFromSchedule(schedule);
    }

    public int getBookedSeatsCount(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ValidationException("Schedule not found with ID: " + scheduleId));
        return getBookedSeatsCountForSchedule(schedule);
    }

    public int getAvailableSeatsCount(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ValidationException("Schedule not found with ID: " + scheduleId));
        int total = getTotalSeatsFromSchedule(schedule);
        int booked = getBookedSeatsCountForSchedule(schedule);
        return total - booked;
    }

    public List<String> getBookedSeats(Long scheduleId) {
        if (!scheduleRepository.existsById(scheduleId)) {
            throw new ValidationException("Schedule not found with ID: " + scheduleId);
        }
        return ticketRepository.findByScheduleId(scheduleId)
                .stream()
                .map(Ticket::getSeatNumber)
                .toList();
    }

    public boolean isSeatAvailable(Long scheduleId, String seatNumber) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ValidationException("Schedule not found with ID: " + scheduleId));
        return !ticketRepository.existsByScheduleAndSeatNumber(schedule, seatNumber);
    }

    public double getTicketPrice(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ValidationException("Schedule not found with ID: " + scheduleId));
        return schedule.getSeatPrice();
    }
   
    private int getTotalSeatsFromSchedule(Schedule schedule) {
        if (schedule.getVessel() != null && schedule.getVessel().getCapacity() > 0) {
            return schedule.getVessel().getCapacity();
        }
        logger.warn("Unable to determine total seats for schedule {}, using default of 50", schedule.getId());
        return 50; 
    }

    private int getBookedSeatsCountForSchedule(Schedule schedule) {
        return ticketRepository.findBySchedule(schedule).size();
    }
}