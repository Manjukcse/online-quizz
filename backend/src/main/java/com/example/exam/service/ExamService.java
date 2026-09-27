package com.example.exam.service;

import com.example.exam.dto.ExamRequest;
import com.example.exam.dto.ExamResponse;

import java.util.List;

public interface ExamService {
    List<ExamResponse> getAllExams(Long currentStudentId);
    List<ExamResponse> getInstructorExams(Long instructorId);
    ExamResponse getExamById(Long examId, Long currentStudentId);
    ExamResponse createExam(ExamRequest request, Long instructorId);
    ExamResponse updateExam(Long examId, ExamRequest request, Long userId);
    void deleteExam(Long examId, Long userId);
}
