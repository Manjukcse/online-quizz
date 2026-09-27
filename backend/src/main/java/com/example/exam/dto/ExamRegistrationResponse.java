package com.example.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamRegistrationResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long examId;
    private String examTitle;
    private String status;
    private LocalDateTime registeredAt;
}
