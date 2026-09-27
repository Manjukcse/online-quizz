package com.example.exam.service;

import com.example.exam.dto.ExamRegistrationResponse;

import java.util.List;

public interface ExamRegistrationService {
    ExamRegistrationResponse registerStudentForExam(Long studentId, Long examId);
    List<ExamRegistrationResponse> getStudentRegistrations(Long studentId);
    List<ExamRegistrationResponse> getRegistrationsByExamId(Long examId);
}
