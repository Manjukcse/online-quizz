package com.example.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamDetailForAttemptDTO {
    private Long id;
    private String title;
    private String description;
    private Integer totalMarks;
    private Integer passingPercentage;
    private Integer durationMinutes;
    private List<QuestionForStudentDTO> questions;
}
