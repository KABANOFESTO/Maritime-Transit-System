package rw.maritime.nvg.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rw.maritime.nvg.model.CargoPayment;

import java.util.List;

@Repository
public interface CargoPaymentRepository extends JpaRepository<CargoPayment, Long> {
    List<CargoPayment> findByPaymentId(Long paymentId);

    List<CargoPayment> findByCargoId(Long cargoId);
}