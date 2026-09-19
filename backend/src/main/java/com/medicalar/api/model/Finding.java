package com.medicalar.api.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "findings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Finding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "report_id", nullable = false)
    private MedicalReport report;

    private String conditionName;
    private String organ;
    private String regionName;
    private String meshId;
    private String description;
    private double confidence;
}
