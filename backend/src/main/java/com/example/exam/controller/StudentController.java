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
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private ExamService examService;

    @Autowired
    private ExamRegistrationService registrationService;

    @Autowired
    private ExamExecutionService examExecutionService;

    @Autowired
    private ResultService resultService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private LearningResourceService learningResourceService;

    @GetMapping("/exams")
    public ResponseEntity<ApiResponse<List<ExamResponse>>> getAvailableExams(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Available exams retrieved", examService.getAllExams(currentUser.getId())));
    }

    @GetMapping("/exams/{id}")
    public ResponseEntity<ApiResponse<ExamResponse>> getExamById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Exam details retrieved", examService.getExamById(id, currentUser.getId())));
    }

    @PostMapping("/exams/{examId}/register")
    public ResponseEntity<ApiResponse<ExamRegistrationResponse>> registerForExam(
            @PathVariable Long examId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Successfully registered for exam", registrationService.registerStudentForExam(currentUser.getId(), examId)));
    }

    @GetMapping("/registrations")
    public ResponseEntity<ApiResponse<List<ExamRegistrationResponse>>> getStudentRegistrations(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Registered exams retrieved", registrationService.getStudentRegistrations(currentUser.getId())));
    }

    @PostMapping("/exams/{examId}/start")
    public ResponseEntity<ApiResponse<ExamDetailForAttemptDTO>> startExam(
            @PathVariable Long examId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Exam started", examExecutionService.startExam(currentUser.getId(), examId)));
    }

    @PostMapping("/exams/submit")
    public ResponseEntity<ApiResponse<ResultResponse>> submitExam(
            @Valid @RequestBody SubmitExamRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Exam submitted successfully", examExecutionService.submitExam(currentUser.getId(), request)));
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<List<ResultResponse>>> getStudentResults(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Results retrieved", resultService.getStudentResults(currentUser.getId())));
    }

    @GetMapping("/results/{id}")
    public ResponseEntity<ApiResponse<ResultResponse>> getResultById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Result details retrieved", resultService.getResultById(id, currentUser.getId())));
    }

    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", notificationService.getUserNotifications(currentUser.getId())));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markNotificationAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        notificationService.markAsRead(id, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read"));
    }

    @GetMapping("/resources")
    public ResponseEntity<ApiResponse<List<LearningResourceDTO>>> getLearningResources() {
        return ResponseEntity.ok(ApiResponse.success("Learning resources retrieved", learningResourceService.getAllResources()));
    }
}
