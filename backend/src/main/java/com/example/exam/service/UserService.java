package com.example.exam.service;

import com.example.exam.dto.InstructorApprovalRequest;
import com.example.exam.dto.RegisterRequest;
import com.example.exam.dto.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    List<UserResponse> getAllStudents();
    List<UserResponse> getAllApprovedInstructors();
    List<UserResponse> getPendingInstructors();
    UserResponse getUserById(Long id);
    UserResponse createUser(RegisterRequest request);
    UserResponse updateUser(Long id, RegisterRequest request);
    void deleteUser(Long id);
    UserResponse approveOrRejectInstructor(Long instructorId, InstructorApprovalRequest request);
}
