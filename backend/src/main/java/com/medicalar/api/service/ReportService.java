package com.medicalar.api.service;

import com.medicalar.api.model.*;
import com.medicalar.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ReportService {
    @Autowired private ReportRepository reportRepository;
    @Autowired private UserRepository userRepository;
    
    @Value("${nlp.engine.url}")
    private String nlpUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String UPLOAD_DIR = "uploads/reports/";

    public MedicalReport processReport(Long userId, MultipartFile file) throws IOException {
        // 1. Save File to Disk
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) dir.mkdirs();
        
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR + fileName);
        Files.copy(file.getInputStream(), path);

        // 2. Call Python NLP Engine
        // In a real scenario, we send the file path or the file bytes
        // For this implementation, we simulate sending the file to the NLP /analyze endpoint
        Map<String, Object> nlpRequest = new HashMap<>();
        nlpRequest.put("filePath", path.toString());
        
        // The Python engine returns the structured analysis
        Map<String, Object> nlpResponse = restTemplate.postForObject(nlpUrl, nlpRequest, Map.class);

        // 3. Create and Save Report Entity
        User user = userRepository.findById(userId).orElseThrow();
        MedicalReport report = MedicalReport.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .filePath(path.toString())
                .uploadDate(LocalDateTime.now())
                .primaryOrgan((String) nlpResponse.get("primaryOrgan"))
                .primaryCondition((String) nlpResponse.get("primaryCondition"))
                .severity((String) nlpResponse.get("severity"))
                .build();

        // 4. Map Findings to Database
        List<Map<String, Object>> findingsList = (List<Map<String, Object>>) nlpResponse.get("findings");
        List<Finding> findings = new ArrayList<>();
        for (Map<String, Object> fMap : findingsList) {
            Finding finding = Finding.builder()
                    .report(report)
                    .conditionName((String) fMap.get("condition"))
                    .organ((String) fMap.get("organ"))
                    .regionName((String) fMap.get("regionName"))
                    .meshId((String) fMap.get("meshId"))
                    .description((String) fMap.get("description"))
                    .confidence((Double) fMap.get("confidence"))
                    .build();
            findings.add(finding);
        }
        report.setFindings(findings);

        return reportRepository.save(report);
    }

    public List<MedicalReport> getUserReports(Long userId) {
        return reportRepository.findByUserId(userId);
    }
}
