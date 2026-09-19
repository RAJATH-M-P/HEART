package com.medicalar.api.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MedicalReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String fileName;
    private String filePath;
    private LocalDateTime uploadDate;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL)
    private List<Finding> findings;

    private String primaryOrgan;
    private String primaryCondition;
    private String severity;
}
