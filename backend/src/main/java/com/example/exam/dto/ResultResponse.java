package com.example.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long examId;
    private String examTitle;
    private Integer totalQuestions;
    private Integer attemptedQuestions;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private Integer totalMarks;
    private Integer obtainedMarks;
    private Double percentage;
    private Integer passingPercentage;
    private String passStatus;
    private LocalDateTime submittedAt;
    private List<AnswerDetailDTO> answers;
    private List<FeedbackResponse> feedbacks;
}
