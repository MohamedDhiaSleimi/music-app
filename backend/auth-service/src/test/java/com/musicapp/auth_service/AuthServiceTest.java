package com.musicapp.auth_service;

import com.musicapp.auth_service.dto.request.LoginRequest;
import com.musicapp.auth_service.dto.request.RegisterRequest;
import com.musicapp.auth_service.dto.response.AuthResponse;
import com.musicapp.auth_service.exception.custom.AccountDeactivatedException;
import com.musicapp.auth_service.exception.custom.EmailAlreadyExistsException;
import com.musicapp.auth_service.mapper.UserMapper;
import com.musicapp.auth_service.model.AccountStatus;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import com.musicapp.auth_service.security.JwtUtil;
import com.musicapp.auth_service.service.AuthService;
import com.musicapp.auth_service.service.EmailService;
import com.musicapp.auth_service.service.EmailVerificationService;
import com.musicapp.auth_service.service.TokenService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

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

    private TokenService tokenService;

    private EmailVerificationService emailVerificationService;


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

    @Test
    void register_WithValidData_ShouldCreateUser() {
        // Arrange
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("newuser@example.com");
        registerRequest.setUsername("newuser");
        registerRequest.setPassword("password123");

        User testUser = new User();
        testUser.setId("test-user-id");
        testUser.setEmail("test@example.com");
        testUser.setUsername("testuser");
        testUser.setPassword("$2a$10$encrypted-password");
        testUser.setStatus(AccountStatus.PENDING_VERIFICATION);  // UPDATED
        testUser.setProvider("local");
        testUser.setCreatedAt(LocalDateTime.now());

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encrypted-password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("test-token");
        when(userMapper.toAuthResponse(any(User.class), anyString())).thenReturn(new AuthResponse("test-token", testUser.getId(), testUser.getEmail(), testUser.getUsername(), testUser.getProfileImageUrl()));

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertNotNull(response);
        assertEquals("test-token", response.getToken());
        verify(userRepository).save(argThat(user -> user.getStatus() == AccountStatus.PENDING_VERIFICATION));
        verify(jwtUtil).generateToken(anyString(), anyString());
    }

    @Test
    void login_WithDeactivatedAccount_ShouldThrowException() {
        // Arrange
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmailOrUsername("test@example.com");
        loginRequest.setPassword("password123");

        User deactivatedUser = new User();
        deactivatedUser.setId("test-id");
        deactivatedUser.setEmail("test@example.com");
        deactivatedUser.setPassword("$2a$10$encrypted-password");
        deactivatedUser.setStatus(AccountStatus.DEACTIVATED);  // UPDATED

        when(userRepository.findByEmailOrUsername(anyString(), anyString())).thenReturn(Optional.of(deactivatedUser));

        // Act & Assert
        assertThrows(AccountDeactivatedException.class, () -> {
            authService.login(loginRequest);
        });
    }

    @Test
    void verifyEmail_ShouldUpdateStatusToActive() {
        // Arrange
        String token = "verification-token";
        User user = new User();
        user.setId("user-id");
        user.setEmail("test@example.com");
        user.setStatus(AccountStatus.PENDING_VERIFICATION);
        user.setEmailVerificationToken(token);
        user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusHours(1));

        when(userRepository.findByEmailVerificationToken(token)).thenReturn(Optional.of(user));
        when(tokenService.isEmailVerificationTokenValid(user)).thenReturn(true);

        // Act
        emailVerificationService.verifyEmail(token);

        // Assert
        verify(userRepository).save(argThat(u -> u.getStatus() == AccountStatus.ACTIVE));
    }
}