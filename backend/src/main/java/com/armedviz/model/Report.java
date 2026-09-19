package com.armedviz.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PROCESSING";

    private String organ;

    @Column(name = "medical_condition")
    private String condition;

    private String conditionCode;

    private String affectedRegion;

    private String unityObjectName;

    private String severity;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String keyFindings;

    @Column(columnDefinition = "LONGTEXT")
    private String rawText;

    @Column(columnDefinition = "TEXT")
    private String nlpResponseJson;

    private Double confidence;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime uploadDate = LocalDateTime.now();
}
