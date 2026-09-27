package com.example.exam.service;

import com.example.exam.dto.FeedbackRequest;
import com.example.exam.dto.FeedbackResponse;

import java.util.List;

public interface FeedbackService {
    FeedbackResponse addFeedback(FeedbackRequest request, Long instructorId);
    List<FeedbackResponse> getFeedbacksByResultId(Long resultId);
}
