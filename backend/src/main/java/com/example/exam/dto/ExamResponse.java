package com.example.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamResponse {
    private Long id;
    private String title;
    private String description;
    private String code;
    private Integer totalMarks;
    private Integer passingPercentage;
    private LocalDate examDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer durationMinutes;
    private Boolean isPublished;
    private Long createdById;
    private String createdByName;
    private Integer totalQuestions;
    private Boolean isRegistered;
    private Boolean isCompleted;
    private String timingStatus; // "NOT_STARTED", "IN_PROGRESS", "EXPIRED"
    private LocalDateTime createdAt;
}
