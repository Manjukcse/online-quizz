package com.example.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminReportDTO {
    private long totalStudents;
    private long totalApprovedInstructors;
    private long totalPendingInstructors;
    private long totalExams;
    private long totalQuestions;
    private long totalExamAttempts;
    private long totalPassedAttempts;
    private long totalFailedAttempts;
    private double overallPassRatePercentage;
}
