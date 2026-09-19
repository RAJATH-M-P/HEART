package com.medicalar.api.controller;

import com.medicalar.api.model.MedicalReport;
import com.medicalar.api.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {
    @Autowired private ReportService reportService;

    @PostMapping("/upload")
    public MedicalReport uploadReport(@RequestParam("file") MultipartFile file, 
                                    @RequestParam("userId") Long userId) throws IOException {
        return reportService.processReport(userId, file);
    }

    @GetMapping("/user/{userId}")
    public List<MedicalReport> getReports(@PathVariable Long userId) {
        return reportService.getUserReports(userId);
    }
}
