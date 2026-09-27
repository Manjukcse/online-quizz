package com.example.exam.controller;

import com.example.exam.dto.*;
import com.example.exam.security.UserPrincipal;
import com.example.exam.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor")
public class InstructorController {

    @Autowired
    private ExamService examService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private ResultService resultService;

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private LearningResourceService learningResourceService;

    @GetMapping("/exams")
    public ResponseEntity<ApiResponse<List<ExamResponse>>> getInstructorExams(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Instructor exams retrieved", examService.getInstructorExams(currentUser.getId())));
    }

    @PostMapping("/exams")
    public ResponseEntity<ApiResponse<ExamResponse>> createExam(
            @Valid @RequestBody ExamRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Exam created successfully", examService.createExam(request, currentUser.getId())));
    }

    @GetMapping("/exams/{id}")
    public ResponseEntity<ApiResponse<ExamResponse>> getExamById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Exam retrieved", examService.getExamById(id, null)));
    }

    @PutMapping("/exams/{id}")
    public ResponseEntity<ApiResponse<ExamResponse>> updateExam(
            @PathVariable Long id,
            @Valid @RequestBody ExamRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Exam updated", examService.updateExam(id, request, currentUser.getId())));
    }

    @DeleteMapping("/exams/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExam(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        examService.deleteExam(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Exam deleted successfully"));
    }

    @GetMapping("/exams/{examId}/questions")
    public ResponseEntity<ApiResponse<List<QuestionResponse>>> getQuestionsByExamId(@PathVariable Long examId) {
        return ResponseEntity.ok(ApiResponse.success("Questions retrieved", questionService.getQuestionsByExamId(examId)));
    }

    @PostMapping("/exams/{examId}/questions")
    public ResponseEntity<ApiResponse<QuestionResponse>> addQuestion(
            @PathVariable Long examId,
            @Valid @RequestBody QuestionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Question added", questionService.addQuestionToExam(examId, request, currentUser.getId())));
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<ApiResponse<QuestionResponse>> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody QuestionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Question updated", questionService.updateQuestion(id, request, currentUser.getId())));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteQuestion(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        questionService.deleteQuestion(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Question deleted successfully"));
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<List<ResultResponse>>> getInstructorResults(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Results retrieved", resultService.getInstructorExamResults(currentUser.getId())));
    }

    @PostMapping("/feedback")
    public ResponseEntity<ApiResponse<FeedbackResponse>> addFeedback(
            @Valid @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Feedback added", feedbackService.addFeedback(request, currentUser.getId())));
    }

    @GetMapping("/resources")
    public ResponseEntity<ApiResponse<List<LearningResourceDTO>>> getLearningResources() {
        return ResponseEntity.ok(ApiResponse.success("Learning resources retrieved", learningResourceService.getAllResources()));
    }

    @PostMapping("/resources")
    public ResponseEntity<ApiResponse<LearningResourceDTO>> addLearningResource(@Valid @RequestBody LearningResourceDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Learning resource added", learningResourceService.createResource(dto)));
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLearningResource(@PathVariable Long id) {
        learningResourceService.deleteResource(id);
        return ResponseEntity.ok(ApiResponse.success("Learning resource deleted successfully"));
    }
}
