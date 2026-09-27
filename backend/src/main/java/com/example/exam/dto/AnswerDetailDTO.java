package com.example.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerDetailDTO {
    private Long questionId;
    private String questionText;
    private Integer questionMarks;
    private Long selectedOptionId;
    private String selectedOptionText;
    private Long correctOptionId;
    private String correctOptionText;
    private Boolean isCorrect;
    private Integer marksObtained;
    private String explanation;
}
