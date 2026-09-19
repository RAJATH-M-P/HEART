package com.medicalar.api.repository;

import com.medicalar.api.model.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<MedicalReport, Long> {
    List<MedicalReport> findByUserId(Long userId);
}
