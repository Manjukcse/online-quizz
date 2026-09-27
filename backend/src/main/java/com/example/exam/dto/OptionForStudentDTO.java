package com.example.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionForStudentDTO {
    private Long id;
    private String optionText;
    // Note: isCorrect is intentionally omitted for students taking the exam!
}
