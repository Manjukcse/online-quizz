package com.example.exam.service.impl;

import com.example.exam.dto.FeedbackRequest;
import com.example.exam.dto.FeedbackResponse;
import com.example.exam.entity.Feedback;
import com.example.exam.entity.Result;
import com.example.exam.entity.User;
import com.example.exam.exception.ResourceNotFoundException;
import com.example.exam.repository.FeedbackRepository;
import com.example.exam.repository.ResultRepository;
import com.example.exam.repository.UserRepository;
import com.example.exam.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public FeedbackResponse addFeedback(FeedbackRequest request, Long instructorId) {
        Result result = resultRepository.findById(request.getResultId())
                .orElseThrow(() -> new ResourceNotFoundException("Result not found with id: " + request.getResultId()));

        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        Feedback feedback = Feedback.builder()
                .result(result)
                .instructor(instructor)
                .comment(request.getComment())
                .rating(request.getRating())
                .build();

        return mapToResponse(feedbackRepository.save(feedback));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeedbackResponse> getFeedbacksByResultId(Long resultId) {
        return feedbackRepository.findByResultId(resultId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private FeedbackResponse mapToResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .resultId(feedback.getResult().getId())
                .instructorId(feedback.getInstructor().getId())
                .instructorName(feedback.getInstructor().getFullName())
                .comment(feedback.getComment())
                .rating(feedback.getRating())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
