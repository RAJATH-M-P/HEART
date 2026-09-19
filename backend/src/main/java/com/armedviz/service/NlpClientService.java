package com.armedviz.service;

import com.armedviz.dto.NlpRequest;
import com.armedviz.dto.NlpResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class NlpClientService {

    private final RestTemplate restTemplate;
    private final String nlpServiceUrl;

    public NlpClientService(@Value("${nlp.service.url}") String nlpServiceUrl) {
        this.restTemplate = new RestTemplate();
        this.nlpServiceUrl = nlpServiceUrl;
    }

    /**
     * Sends report text to the NLP microservice for analysis.
     */
    public NlpResponse analyzeReport(String text, String fileName) {
        try {
            NlpRequest request = new NlpRequest();
            request.setText(text);
            request.setFileName(fileName);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<NlpRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<NlpResponse> response = restTemplate.exchange(
                    nlpServiceUrl,
                    HttpMethod.POST,
                    entity,
                    NlpResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }

            log.error("NLP service returned non-success status: {}", response.getStatusCode());
            return null;

        } catch (Exception e) {
            log.error("Error calling NLP service: {}", e.getMessage(), e);
            return null;
        }
    }
}
