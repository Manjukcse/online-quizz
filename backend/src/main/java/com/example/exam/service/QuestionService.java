package com.example.exam.service;

import com.example.exam.dto.QuestionRequest;
import com.example.exam.dto.QuestionResponse;

import java.util.List;

public interface QuestionService {
    List<QuestionResponse> getQuestionsByExamId(Long examId);
    QuestionResponse getQuestionById(Long questionId);
    QuestionResponse addQuestionToExam(Long examId, QuestionRequest request, Long userId);
    QuestionResponse updateQuestion(Long questionId, QuestionRequest request, Long userId);
    void deleteQuestion(Long questionId, Long userId);
}
