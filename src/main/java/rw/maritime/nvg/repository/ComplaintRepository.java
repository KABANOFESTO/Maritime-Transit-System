package rw.maritime.nvg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.maritime.nvg.model.Complaint;
import rw.maritime.nvg.model.User;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUser(User user);
    List<Complaint> findByStatus(String status);
    List<Complaint> findBySubmittedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Complaint> findBySubjectContainingIgnoreCase(String keyword);
}