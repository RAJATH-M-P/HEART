package com.armedviz.controller;

import com.armedviz.config.JwtUtil;
import com.armedviz.model.Report;
import com.armedviz.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final JwtUtil jwtUtil;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadReport(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            Report report = reportService.processReport(file, userId);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Report>> getUserReports(HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(reportService.getUserReports(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReport(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            Report report = reportService.getReportById(id, userId);
            return ResponseEntity.ok(report);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/ar-params")
    public ResponseEntity<?> getArParams(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long userId = getUserId(request);
            Report report = reportService.getReportById(id, userId);

            Map<String, Object> arParams = Map.of(
                    "organ", report.getOrgan() != null ? report.getOrgan() : "",
                    "condition", report.getCondition() != null ? report.getCondition() : "",
                    "conditionCode", report.getConditionCode() != null ? report.getConditionCode() : "",
                    "affectedRegion", report.getAffectedRegion() != null ? report.getAffectedRegion() : "",
                    "unityObjectName", report.getUnityObjectName() != null ? report.getUnityObjectName() : "",
                    "severity", report.getSeverity() != null ? report.getSeverity() : "",
                    "confidence", report.getConfidence() != null ? report.getConfidence() : 0.0
            );

            return ResponseEntity.ok(arParams);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(HttpServletRequest request) {
        Long userId = getUserId(request);
        long totalReports = reportService.getReportCount(userId);
        return ResponseEntity.ok(Map.of("totalReports", totalReports));
    }

    private Long getUserId(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        if (userId != null) return userId;

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                userId = jwtUtil.extractUserId(authHeader.substring(7));
            } catch (Exception e) {
                userId = null;
            }
        }
        
        // For demo purposes, return a default user ID if not authenticated
        return (userId != null) ? userId : 1L;
    }
}
