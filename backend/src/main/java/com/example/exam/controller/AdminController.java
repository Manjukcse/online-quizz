package com.example.exam.controller;

import com.example.exam.dto.*;
import com.example.exam.service.ExamService;
import com.example.exam.service.ReportService;
import com.example.exam.service.ResultService;
import com.example.exam.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private ExamService examService;

    @Autowired
    private ResultService resultService;

    @Autowired
    private ReportService reportService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", userService.getAllUsers()));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.success("Students retrieved", userService.getAllStudents()));
    }

    @GetMapping("/instructors")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllApprovedInstructors() {
        return ResponseEntity.ok(ApiResponse.success("Approved instructors retrieved", userService.getAllApprovedInstructors()));
    }

    @GetMapping("/instructors/pending")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getPendingInstructors() {
        return ResponseEntity.ok(ApiResponse.success("Pending instructors retrieved", userService.getPendingInstructors()));
    }

    @PutMapping("/instructors/{id}/approve")
    public ResponseEntity<ApiResponse<UserResponse>> approveInstructor(
            @PathVariable Long id,
            @Valid @RequestBody InstructorApprovalRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Instructor status updated", userService.approveOrRejectInstructor(id, request)));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created", userService.createUser(request)));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable Long id, @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success("User updated", userService.updateUser(id, request)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<AdminReportDTO>> getAdminReport() {
        return ResponseEntity.ok(ApiResponse.success("Admin report generated", reportService.getAdminReport()));
    }

    @GetMapping("/exams")
    public ResponseEntity<ApiResponse<List<ExamResponse>>> getAllExams() {
        return ResponseEntity.ok(ApiResponse.success("All exams retrieved", examService.getAllExams(null)));
    }

    @GetMapping("/results")
    public ResponseEntity<ApiResponse<List<ResultResponse>>> getAllResults() {
        return ResponseEntity.ok(ApiResponse.success("All exam results retrieved", resultService.getAllResultsForAdmin()));
    }
}
