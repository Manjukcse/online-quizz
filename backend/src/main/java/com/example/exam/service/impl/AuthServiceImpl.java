package com.example.exam.service.impl;

import com.example.exam.dto.LoginRequest;
import com.example.exam.dto.LoginResponse;
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
import com.example.exam.security.JwtTokenProvider;
import com.example.exam.security.UserPrincipal;
import com.example.exam.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_INSTRUCTOR)
                && user.getStatus() == UserStatus.PENDING) {
            throw new BadRequestException("Your instructor account is pending admin approval.");
        }

        if (user.getStatus() == UserStatus.REJECTED) {
            throw new BadRequestException("Your account has been rejected by system administrator.");
        }

        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return LoginResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .id(userPrincipal.getId())
                .username(userPrincipal.getUsername())
                .email(userPrincipal.getEmail())
                .fullName(userPrincipal.getFullName())
                .status(user.getStatus().name())
                .roles(roles)
                .build();
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email Address is already in use!");
        }

        RoleName targetRoleName = RoleName.ROLE_STUDENT;
        UserStatus initialStatus = UserStatus.APPROVED;

        String requestedRole = registerRequest.getRole() != null ? registerRequest.getRole().trim() : "";
        if (requestedRole.equalsIgnoreCase("ROLE_INSTRUCTOR") || requestedRole.equalsIgnoreCase("INSTRUCTOR")) {
            targetRoleName = RoleName.ROLE_INSTRUCTOR;
            initialStatus = UserStatus.PENDING; // Requires Admin approval
        } else if (requestedRole.equalsIgnoreCase("ROLE_ADMIN") || requestedRole.equalsIgnoreCase("ADMIN")) {
            targetRoleName = RoleName.ROLE_ADMIN;
            initialStatus = UserStatus.APPROVED;
        } else {
            targetRoleName = RoleName.ROLE_STUDENT;
            initialStatus = UserStatus.APPROVED;
        }

        final RoleName finalRoleName = targetRoleName;
        Role role = roleRepository.findByName(finalRoleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + finalRoleName));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .address(registerRequest.getAddress())
                .mobile(registerRequest.getMobile())
                .status(initialStatus)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        return mapToUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return mapToUserResponse(user);
    }

    private UserResponse mapToUserResponse(User user) {
        Set<String> roleNames = user.getRoles().stream()
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
                .roles(roleNames)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
