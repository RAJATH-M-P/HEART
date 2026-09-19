package com.medical.ar.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.medical.ar.service.NlpService;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private NlpService nlpService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadReport(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        if (text == null || text.isEmpty()) {
            return ResponseEntity.badRequest().body("Report text is missing");
        }

        try {
            // This calls the Python NLP engine via REST
            Map<String, Object> analysisResult = nlpService.analyzeText(text);
            return ResponseEntity.ok(analysisResult);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error analyzing report: " + e.getMessage());
        }
    }
}
