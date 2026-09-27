package com.example.exam.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentAnswerDTO {
    @NotNull(message = "Question ID is required")
    private Long questionId;

    private Long selectedOptionId; // Nullable if student skipped question
}
