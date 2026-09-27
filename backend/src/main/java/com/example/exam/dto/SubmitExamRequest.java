package com.example.exam.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SubmitExamRequest {
    @NotNull(message = "Exam ID is required")
    private Long examId;

    private List<StudentAnswerDTO> answers;
}
