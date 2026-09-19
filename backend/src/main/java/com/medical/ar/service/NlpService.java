package com.medical.ar.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.HashMap;

@Service
public class NlpService {

    private final String PYTHON_API_URL = "http://localhost:5000/api/analyze";
    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> analyzeText(String text) {
        // Prepare request for the Python NLP engine
        Map<String, String> request = new HashMap<>();
        request.put("text", text);
        request.put("fileName", "web_upload.txt");

        // Call Python API and return the mapping result
        try {
            return restTemplate.postForObject(PYTHON_API_URL, request, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Python NLP Service unavailable: " + e.getMessage());
        }
    }
}
