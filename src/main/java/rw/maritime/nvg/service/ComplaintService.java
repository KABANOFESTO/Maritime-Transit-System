package rw.maritime.nvg.service;

import org.springframework.stereotype.Service;
import rw.maritime.nvg.model.*;
import rw.maritime.nvg.repository.ComplaintRepository;
import rw.maritime.nvg.repository.UserRepository;
import rw.maritime.nvg.DTO.ComplaintRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintService(ComplaintRepository complaintRepository,
                          UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Optional<Complaint> getComplaintById(Long id) {
        return complaintRepository.findById(id);
    }

    public List<Complaint> getComplaintsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return complaintRepository.findByUser(user);
    }

    public List<Complaint> getComplaintsByStatus(String status) {
        return complaintRepository.findByStatus(status);
    }

    public List<Complaint> getComplaintsByDateRange(LocalDateTime start, LocalDateTime end) {
        return complaintRepository.findBySubmittedAtBetween(start, end);
    }

    public List<Complaint> searchComplaintsByKeyword(String keyword) {
        return complaintRepository.findBySubjectContainingIgnoreCase(keyword);
    }

    public Complaint createComplaint(ComplaintRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = new Complaint();
        complaint.setUser(user);
        complaint.setSubject(request.getSubject());
        complaint.setMessage(request.getMessage());
        complaint.setStatus("Pending");
        complaint.setSubmittedAt(LocalDateTime.now());

        return complaintRepository.save(complaint);
    }

    public Complaint updateComplaintStatus(Long id, String status) {
        return complaintRepository.findById(id)
                .map(complaint -> {
                    complaint.setStatus(status);
                    return complaintRepository.save(complaint);
                })
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }

    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }

}