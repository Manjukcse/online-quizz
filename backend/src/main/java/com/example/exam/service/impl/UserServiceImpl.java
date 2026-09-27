package com.example.exam.service.impl;

import com.example.exam.dto.InstructorApprovalRequest;
import com.example.exam.dto.RegisterRequest;
import com.example.exam.dto.UserResponse;
import com.example.exam.entity.Role;
import com.example.exam.entity.RoleName;
import com.example.exam.entity.User;
import com.example.exam.entity.UserStatus;
import com.example.exam.exception.BadRequestException;
import com.example.exam.exception.ResourceNotFoundException;
import com.example.exam.repository.RoleRepository;
import com.example.exam.repository.UserRepository;
import com.example.exam.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllStudents() {
        return userRepository.findByRoleName(RoleName.ROLE_STUDENT).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllApprovedInstructors() {
        return userRepository.findByRoleNameAndStatus(RoleName.ROLE_INSTRUCTOR, UserStatus.APPROVED).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getPendingInstructors() {
        return userRepository.findByRoleNameAndStatus(RoleName.ROLE_INSTRUCTOR, UserStatus.PENDING).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        RoleName roleName = RoleName.ROLE_STUDENT;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ROLE_INSTRUCTOR")) {
            roleName = RoleName.ROLE_INSTRUCTOR;
        }

        final RoleName targetRoleName = roleName;
        Role role = roleRepository.findByName(targetRoleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + targetRoleName));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .address(request.getAddress())
                .mobile(request.getMobile())
                .status(UserStatus.APPROVED)
                .roles(roles)
                .build();

        return mapToUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, RegisterRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setAddress(request.getAddress());
        user.setMobile(request.getMobile());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return mapToUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public UserResponse approveOrRejectInstructor(Long instructorId, InstructorApprovalRequest request) {
        User user = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + instructorId));

        if (request.getApprove()) {
            user.setStatus(UserStatus.APPROVED);
            if (request.getSalary() != null) {
                user.setSalary(request.getSalary());
            }
        } else {
            user.setStatus(UserStatus.REJECTED);
        }

        return mapToUserResponse(userRepository.save(user));
    }

    private UserResponse mapToUserResponse(User user) {
        Set<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet());

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .address(user.getAddress())
                .mobile(user.getMobile())
                .status(user.getStatus().name())
                .salary(user.getSalary())
                .profilePicUrl(user.getProfilePicUrl())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
