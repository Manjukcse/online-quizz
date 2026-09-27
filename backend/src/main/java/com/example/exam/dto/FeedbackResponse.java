package com.example.exam.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponse {
    private Long id;
    private Long resultId;
    private Long instructorId;
    private String instructorName;
    private String comment;
    private Integer rating;
    private LocalDateTime createdAt;
}
