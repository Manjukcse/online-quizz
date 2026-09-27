package com.example.exam.service;

import com.example.exam.dto.ExamDetailForAttemptDTO;
import com.example.exam.dto.ResultResponse;
import com.example.exam.dto.SubmitExamRequest;

public interface ExamExecutionService {
    ExamDetailForAttemptDTO startExam(Long studentId, Long examId);
    ResultResponse submitExam(Long studentId, SubmitExamRequest request);
}
