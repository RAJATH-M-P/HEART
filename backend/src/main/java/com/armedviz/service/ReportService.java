package com.armedviz.service;

import com.armedviz.dto.NlpResponse;
import com.armedviz.model.Report;
import com.armedviz.repository.ReportRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final ReportRepository reportRepository;
    private final TextExtractionService textExtractionService;
    private final NlpClientService nlpClientService;
    private final ObjectMapper objectMapper;

    /**
     * Processes a medical report: extracts text, calls NLP, saves results.
     */
    public Report processReport(MultipartFile file, Long userId) throws IOException {
        // 1. Extract text from the uploaded file
        String rawText = textExtractionService.extractText(file);

        // 2. Create initial report entry
        Report report = Report.builder()
                .userId(userId)
                .fileName(file.getOriginalFilename())
                .rawText(rawText)
                .status("PROCESSING")
                .build();
        report = reportRepository.save(report);

        // 3. Call NLP service
        NlpResponse nlpResponse = nlpClientService.analyzeReport(rawText, file.getOriginalFilename());

        // 4. Update report with NLP results
        if (nlpResponse != null) {
            report.setOrgan(nlpResponse.getOrgan());
            report.setCondition(nlpResponse.getCondition());
            report.setConditionCode(nlpResponse.getConditionCode());
            report.setSeverity(nlpResponse.getSeverity());
            report.setSummary(nlpResponse.getSummary());
            report.setStatus("COMPLETED");

            if (nlpResponse.getAffectedRegions() != null && !nlpResponse.getAffectedRegions().isEmpty()) {
                NlpResponse.AffectedRegion primary = nlpResponse.getAffectedRegions().get(0);
                report.setAffectedRegion(primary.getName());
                report.setUnityObjectName(primary.getUnityObject());
                report.setConfidence(primary.getConfidence());
            }

            if (nlpResponse.getKeyFindings() != null) {
                report.setKeyFindings(String.join("; ", nlpResponse.getKeyFindings()));
            }

            try {
                report.setNlpResponseJson(objectMapper.writeValueAsString(nlpResponse));
            } catch (Exception e) {
                log.error("Error serializing NLP response", e);
            }
        } else {
            report.setStatus("FAILED");
            report.setSummary("NLP analysis could not process this report. Please try again.");
        }

        return reportRepository.save(report);
    }

    public List<Report> getUserReports(Long userId) {
        return reportRepository.findByUserIdOrderByUploadDateDesc(userId);
    }

    public Report getReportById(Long id, Long userId) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if (!report.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }

        return report;
    }

    public long getReportCount(Long userId) {
        return reportRepository.countByUserId(userId);
    }
}
