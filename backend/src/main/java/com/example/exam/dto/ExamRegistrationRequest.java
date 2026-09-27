package com.example.exam.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ExamRegistrationRequest {
    @NotNull(message = "Exam ID is required")
    private Long examId;
}
