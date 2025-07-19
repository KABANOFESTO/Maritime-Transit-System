package rw.maritime.nvg.service.impl;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rw.maritime.nvg.DTO.PaymentRequestDTO;
import rw.maritime.nvg.DTO.PaymentResponseDTO;
import rw.maritime.nvg.model.*;
import rw.maritime.nvg.repository.*;
import rw.maritime.nvg.service.PaymentService;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StripePaymentServiceImpl implements PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    private final TicketRepository ticketRepository;
    private final CargoRepository cargoRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    public StripePaymentServiceImpl(TicketRepository ticketRepository,
            CargoRepository cargoRepository,
            UserRepository userRepository,
            PaymentRepository paymentRepository) {
        this.ticketRepository = ticketRepository;
        this.cargoRepository = cargoRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Override
    public PaymentResponseDTO createPaymentIntent(PaymentRequestDTO paymentRequest) {
        try {
            // Calculate total amount
            double ticketsAmount = calculateTicketsAmount(paymentRequest.getTicketIds());
            double cargoAmount = calculateCargoAmount(paymentRequest.getCargoIds());
            double totalAmount = ticketsAmount + cargoAmount;

            // Create Stripe payment intent
            PaymentIntentCreateParams.Builder paramsBuilder = PaymentIntentCreateParams.builder()
                    .setAmount((long) (totalAmount * 100)) // Stripe uses cents
                    .setCurrency(paymentRequest.getCurrency().toLowerCase())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build());

            // Only set payment method if it's a valid PaymentMethod ID (starts with pm_)
            if (paymentRequest.getPaymentMethod() != null &&
                    paymentRequest.getPaymentMethod().startsWith("pm_")) {
                paramsBuilder.setPaymentMethod(paymentRequest.getPaymentMethod());
            }

            PaymentIntentCreateParams params = paramsBuilder.build();
            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Save payment record - use Stripe's actual status
            Payment payment = new Payment();
            payment.setUser(userRepository.findById(paymentRequest.getUserId()).orElseThrow());
            payment.setAmount(totalAmount);
            payment.setCurrency(paymentRequest.getCurrency());
            payment.setPaymentStatus(paymentIntent.getStatus()); // Use Stripe's status
            payment.setPaymentMethod(
                    paymentRequest.getPaymentMethod() != null ? paymentRequest.getPaymentMethod() : "card");
            payment.setPaymentDate(LocalDateTime.now());
            payment.setStripePaymentIntentId(paymentIntent.getId());

            Payment savedPayment = paymentRepository.save(payment);

            // Link tickets to payment
            linkTicketsToPayment(paymentRequest.getTicketIds(), savedPayment, ticketsAmount);

            // Link cargo to payment
            linkCargoToPayment(paymentRequest.getCargoIds(), savedPayment, cargoAmount);

            // Save again to persist relationships
            savedPayment = paymentRepository.save(savedPayment);

            // Return response
            return createPaymentResponse(savedPayment, paymentIntent.getClientSecret(),
                    paymentRequest.getTicketIds(), paymentRequest.getCargoIds());

        } catch (StripeException e) {
            throw new RuntimeException("Failed to create payment intent", e);
        }
    }

    @Override
    public PaymentResponseDTO confirmPayment(String paymentIntentId) {
        try {
            // Extract actual PaymentIntent ID if a client secret was passed
            String actualPaymentIntentId = paymentIntentId;
            if (paymentIntentId.contains("_secret_")) {
                actualPaymentIntentId = paymentIntentId.split("_secret_")[0];
            }

            PaymentIntent paymentIntent = PaymentIntent.retrieve(actualPaymentIntentId);

            Payment payment = paymentRepository.findByStripePaymentIntentId(actualPaymentIntentId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            // Update payment status based on Stripe's status
            payment.setPaymentStatus(paymentIntent.getStatus());
            payment = paymentRepository.save(payment);

            // If payment succeeded, mark tickets and cargo as paid
            if ("succeeded".equals(paymentIntent.getStatus())) {
                updateTicketsAsPaid(payment);
                updateCargoAsPaid(payment);
            }

            // Get ticket and cargo IDs - force load relationships
            List<Long> ticketIds = payment.getTicketPayments().stream()
                    .map(tp -> tp.getTicket().getId())
                    .collect(Collectors.toList());

            List<Long> cargoIds = payment.getCargoPayments().stream()
                    .map(cp -> cp.getCargo().getId())
                    .collect(Collectors.toList());

            return createPaymentResponse(payment, null, ticketIds, cargoIds);
        } catch (StripeException e) {
            throw new RuntimeException("Failed to confirm payment", e);
        }
    }

    private double calculateTicketsAmount(List<Long> ticketIds) {
        if (ticketIds == null || ticketIds.isEmpty())
            return 0.0;

        return ticketRepository.findAllById(ticketIds).stream()
                .mapToDouble(ticket -> ticket.getSchedule().getSeatPrice())
                .sum();
    }

    private double calculateCargoAmount(List<Long> cargoIds) {
        if (cargoIds == null || cargoIds.isEmpty())
            return 0.0;

        return cargoRepository.findAllById(cargoIds).stream()
                .mapToDouble(Cargo::getPrice)
                .sum();
    }

    private void linkTicketsToPayment(List<Long> ticketIds, Payment payment, double amount) {
        if (ticketIds == null || ticketIds.isEmpty())
            return;

        double individualAmount = amount / ticketIds.size();

        ticketIds.forEach(ticketId -> {
            Ticket ticket = ticketRepository.findById(ticketId).orElseThrow();
            TicketPayment ticketPayment = new TicketPayment();
            ticketPayment.setPayment(payment);
            ticketPayment.setTicket(ticket);
            ticketPayment.setAmount(individualAmount);
            payment.addTicketPayment(ticketPayment);
        });
    }

    private void linkCargoToPayment(List<Long> cargoIds, Payment payment, double amount) {
        if (cargoIds == null || cargoIds.isEmpty())
            return;

        double individualAmount = amount / cargoIds.size();

        cargoIds.forEach(cargoId -> {
            Cargo cargo = cargoRepository.findById(cargoId).orElseThrow();
            CargoPayment cargoPayment = new CargoPayment();
            cargoPayment.setPayment(payment);
            cargoPayment.setCargo(cargo);
            cargoPayment.setAmount(individualAmount);
            payment.addCargoPayment(cargoPayment);
        });
    }

    private void updateTicketsAsPaid(Payment payment) {
        payment.getTicketPayments().forEach(ticketPayment -> {
            Ticket ticket = ticketPayment.getTicket();
            ticket.setPaid(true);
            ticketRepository.save(ticket);
        });
    }

    private void updateCargoAsPaid(Payment payment) {
        // You might want to update cargo status here if needed
        // For example: mark as "paid" or "ready for shipment"
    }

    private PaymentResponseDTO createPaymentResponse(Payment payment, String clientSecret,
            List<Long> ticketIds, List<Long> cargoIds) {
        PaymentResponseDTO response = new PaymentResponseDTO();
        response.setId(payment.getId());
        response.setAmount(payment.getAmount());
        response.setCurrency(payment.getCurrency());
        response.setPaymentStatus(payment.getPaymentStatus());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setPaymentDate(payment.getPaymentDate());
        response.setClientSecret(clientSecret);
        response.setTicketIds(ticketIds);
        response.setCargoIds(cargoIds);
        return response;
    }
}