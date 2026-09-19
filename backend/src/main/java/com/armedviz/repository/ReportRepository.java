package com.armedviz.repository;

import com.armedviz.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUserIdOrderByUploadDateDesc(Long userId);
    long countByUserId(Long userId);
}
