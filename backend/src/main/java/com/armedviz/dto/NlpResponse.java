package com.armedviz.dto;

import lombok.Data;
import java.util.List;

@Data
public class NlpResponse {
    private String organ;
    private String condition;
    private String conditionCode;
    private List<AffectedRegion> affectedRegions;
    private String severity;
    private String summary;
    private List<String> keyFindings;

    @Data
    public static class AffectedRegion {
        private String name;
        private String unityObject;
        private Double confidence;
    }
}
