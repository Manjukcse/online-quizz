package com.example.exam.service;

import com.example.exam.dto.ResultResponse;

import java.util.List;

public interface ResultService {
    List<ResultResponse> getStudentResults(Long studentId);
    List<ResultResponse> getInstructorExamResults(Long instructorId);
    ResultResponse getResultById(Long resultId, Long userId);
    List<ResultResponse> getAllResultsForAdmin();
}
