package com.example.exam;

import com.example.exam.dto.LoginRequest;
import com.example.exam.dto.LoginResponse;
import com.example.exam.dto.RegisterRequest;
import com.example.exam.dto.UserResponse;
import com.example.exam.entity.Role;
import com.example.exam.entity.RoleName;
import com.example.exam.entity.User;
import com.example.exam.entity.UserStatus;
import com.example.exam.exception.BadRequestException;
import com.example.exam.repository.RoleRepository;
import com.example.exam.repository.UserRepository;
import com.example.exam.security.JwtTokenProvider;
import com.example.exam.security.UserPrincipal;
import com.example.exam.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

//import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;
    private Role studentRole;

    @BeforeEach
    void setUp() {
        studentRole = Role.builder().id(1L).name(RoleName.ROLE_STUDENT).build();
        sampleUser = User.builder()
                .id(1L)
                .username("teststudent")
                .email("student@test.com")
                .password("password123")
                .firstName("Test")
                .lastName("Student")
                .status(UserStatus.APPROVED)
                .roles(Set.of(studentRole))
                .build();
    }

    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("teststudent");
        request.setPassword("password123");

        UserPrincipal principal = UserPrincipal.create(sampleUser);
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(principal);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("dummy-jwt-token");
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("dummy-jwt-token", response.getAccessToken());
        assertEquals("teststudent", response.getUsername());
    }

    @Test
    void testRegisterStudentSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newstudent");
        request.setEmail("new@test.com");
        request.setPassword("password123");
        request.setFirstName("New");
        request.setLastName("Student");
        request.setRole("ROLE_STUDENT");

        when(userRepository.existsByUsername("newstudent")).thenReturn(false);
        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.ROLE_STUDENT)).thenReturn(Optional.of(studentRole));
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(2L);
            return u;
        });

        UserResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("newstudent", response.getUsername());
        assertEquals("APPROVED", response.getStatus());
    }

    @Test
    void testRegisterDuplicateUsernameThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("teststudent");
        request.setEmail("new@test.com");

        when(userRepository.existsByUsername("teststudent")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }
}
