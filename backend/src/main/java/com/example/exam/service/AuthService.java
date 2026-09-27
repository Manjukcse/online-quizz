package com.example.exam.service;

import com.example.exam.dto.LoginRequest;
import com.example.exam.dto.LoginResponse;
import com.example.exam.dto.RegisterRequest;
import com.example.exam.dto.UserResponse;

public interface AuthService {
    LoginResponse login(LoginRequest loginRequest);
    UserResponse register(RegisterRequest registerRequest);
    UserResponse getCurrentUser(Long userId);
}
