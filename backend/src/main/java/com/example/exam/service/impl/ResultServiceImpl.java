package com.example.exam.service.impl;

import com.example.exam.dto.AnswerDetailDTO;
import com.example.exam.dto.FeedbackResponse;
import com.example.exam.dto.ResultResponse;
import com.example.exam.entity.Option;
import com.example.exam.entity.Result;

import com.example.exam.exception.ResourceNotFoundException;
import com.example.exam.repository.FeedbackRepository;
import com.example.exam.repository.ResultRepository;
import com.example.exam.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResultServiceImpl implements ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ResultResponse> getStudentResults(Long studentId) {
        return resultRepository.findByStudentId(studentId).stream()
                .map(this::mapToResultResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResultResponse> getInstructorExamResults(Long instructorId) {
        return resultRepository.findByExamCreatedById(instructorId).stream()
                .map(this::mapToResultResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ResultResponse getResultById(Long resultId, Long userId) {
        Result result = resultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found with id: " + resultId));
        return mapToResultResponse(result);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResultResponse> getAllResultsForAdmin() {
        return resultRepository.findAll().stream()
                .map(this::mapToResultResponse)
                .collect(Collectors.toList());
    }

    private ResultResponse mapToResultResponse(Result result) {
        List<AnswerDetailDTO> answerDetails = result.getAnswers().stream()
                .map(a -> {
                    Option correctOpt = a.getQuestion().getOptions().stream()
                            .filter(o -> Boolean.TRUE.equals(o.getIsCorrect()))
                            .findFirst().orElse(null);

                    return AnswerDetailDTO.builder()
                            .questionId(a.getQuestion().getId())
                            .questionText(a.getQuestion().getQuestionText())
                            .questionMarks(a.getQuestion().getMarks())
                            .selectedOptionId(a.getSelectedOption() != null ? a.getSelectedOption().getId() : null)
                            .selectedOptionText(a.getSelectedOption() != null ? a.getSelectedOption().getOptionText() : "Not Attempted")
                            .correctOptionId(correctOpt != null ? correctOpt.getId() : null)
                            .correctOptionText(correctOpt != null ? correctOpt.getOptionText() : "")
                            .isCorrect(a.getIsCorrect())
                            .marksObtained(a.getMarksObtained())
                            .explanation(a.getQuestion().getExplanation())
                            .build();
                })
                .collect(Collectors.toList());

        List<FeedbackResponse> feedbacks = feedbackRepository.findByResultId(result.getId()).stream()
                .map(f -> FeedbackResponse.builder()
                        .id(f.getId())
                        .resultId(f.getResult().getId())
                        .instructorId(f.getInstructor().getId())
                        .instructorName(f.getInstructor().getFullName())
                        .comment(f.getComment())
                        .rating(f.getRating())
                        .createdAt(f.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResultResponse.builder()
                .id(result.getId())
                .studentId(result.getStudent().getId())
                .studentName(result.getStudent().getFullName())
                .examId(result.getExam().getId())
                .examTitle(result.getExam().getTitle())
                .totalQuestions(result.getTotalQuestions())
                .attemptedQuestions(result.getAttemptedQuestions())
                .correctAnswers(result.getCorrectAnswers())
                .wrongAnswers(result.getWrongAnswers())
                .totalMarks(result.getTotalMarks())
                .obtainedMarks(result.getObtainedMarks())
                .percentage(result.getPercentage())
                .passingPercentage(result.getExam().getPassingPercentage())
                .passStatus(result.getPassStatus().name())
                .submittedAt(result.getSubmittedAt())
                .answers(answerDetails)
                .feedbacks(feedbacks)
                .build();
    }
}
