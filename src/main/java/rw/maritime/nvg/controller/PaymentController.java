// package rw.maritime.nvg.controller;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import rw.maritime.nvg.DTO.PaymentRequestDTO;
// import rw.maritime.nvg.DTO.PaymentResponseDTO;
// import rw.maritime.nvg.service.PaymentService;

// @RestController
// @RequestMapping("/api/v1/payments")
// public class PaymentController {

//     private final PaymentService paymentService;

//     public PaymentController(PaymentService paymentService) {
//         this.paymentService = paymentService;
//     }

//     @PostMapping
//     public ResponseEntity<PaymentResponseDTO> createPayment(@RequestBody PaymentRequestDTO paymentRequest) {
//         PaymentResponseDTO response = paymentService.createPaymentIntent(paymentRequest);
//         return ResponseEntity.ok(response);
//     }

//     @PostMapping("/confirm")
//     public ResponseEntity<PaymentResponseDTO> confirmPayment(@RequestParam String paymentIntentId) {
//         PaymentResponseDTO response = paymentService.confirmPayment(paymentIntentId);
//         return ResponseEntity.ok(response);
//     }
// }