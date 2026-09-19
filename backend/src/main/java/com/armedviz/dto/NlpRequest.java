package com.armedviz.dto;

import lombok.Data;
import java.util.List;

@Data
public class NlpRequest {
    private String text;
    private String fileName;
}
