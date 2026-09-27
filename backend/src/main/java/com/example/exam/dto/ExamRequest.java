package com.example.exam.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ExamRequest {

    @NotBlank(message = "Exam title is required")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    private String description;

    private String code;

    @NotNull(message = "Total marks is required")
    @Min(value = 1, message = "Total marks must be positive")
    private Integer totalMarks;

    @NotNull(message = "Passing percentage is required")
    @Min(value = 0, message = "Passing percentage cannot be negative")
    @Max(value = 100, message = "Passing percentage cannot exceed 100")
    private Integer passingPercentage;

    @NotNull(message = "Exam date is required")
    private LocalDate examDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotNull(message = "Duration in minutes is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer durationMinutes;

    private Boolean isPublished = true;
}
