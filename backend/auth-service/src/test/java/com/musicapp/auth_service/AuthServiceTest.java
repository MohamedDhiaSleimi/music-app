package com.musicapp.auth_service;

import com.musicapp.auth_service.dto.request.RegisterRequest;
import com.musicapp.auth_service.dto.response.AuthResponse;
import com.musicapp.auth_service.exception.custom.EmailAlreadyExistsException;
import com.musicapp.auth_service.mapper.UserMapper;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import com.musicapp.auth_service.security.JwtUtil;
import com.musicapp.auth_service.service.AuthService;
import com.musicapp.auth_service.service.EmailService;
import com.musicapp.auth_service.util.TestDataBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private EmailService emailService;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        registerRequest = TestDataBuilder.createRegisterRequest();
        testUser = TestDataBuilder.createTestUser();
    }

    @Test
    void register_WithValidData_ShouldCreateUser() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encrypted-password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("test-token");
        when(userMapper.toAuthResponse(any(User.class), anyString())).thenReturn(
                new AuthResponse("test-token", testUser.getId(), testUser.getEmail(),
                        testUser.getUsername(), testUser.getProfileImageUrl())
        );

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertNotNull(response);
        assertEquals("test-token", response.getToken());
        verify(userRepository).save(any(User.class));
        verify(jwtUtil).generateToken(anyString(), anyString());
    }

    @Test
    void register_WithExistingEmail_ShouldThrowException() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // Act & Assert
        assertThrows(EmailAlreadyExistsException.class, () -> {
            authService.register(registerRequest);
        });

        verify(userRepository, never()).save(any(User.class));
    }
}