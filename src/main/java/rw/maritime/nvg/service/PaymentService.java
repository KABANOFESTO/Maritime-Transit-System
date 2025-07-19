package rw.maritime.nvg.service;

import rw.maritime.nvg.DTO.PaymentRequestDTO;
import rw.maritime.nvg.DTO.PaymentResponseDTO;

public interface PaymentService {
    PaymentResponseDTO createPaymentIntent(PaymentRequestDTO paymentRequest);

    PaymentResponseDTO confirmPayment(String paymentIntentId);

}