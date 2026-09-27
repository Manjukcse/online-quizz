package com.example.exam.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningResourceDTO {
    private Long id;
    private Long examId;
    private String examTitle;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Resource URL is required")
    private String resourceUrl;

    private LocalDateTime createdAt;
}
