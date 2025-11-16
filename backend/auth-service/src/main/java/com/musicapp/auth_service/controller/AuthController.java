package com.musicapp.auth_service.controller;

import com.musicapp.auth_service.constants.AppConstants;
import com.musicapp.auth_service.dto.request.*;
import com.musicapp.auth_service.dto.response.AuthResponse;
import com.musicapp.auth_service.dto.response.MessageResponse;
import com.musicapp.auth_service.mapper.UserMapper;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.service.AuthService;
import com.musicapp.auth_service.service.EmailVerificationService;
import com.musicapp.auth_service.service.PasswordService;
import com.musicapp.auth_service.util.UserIdExtractor;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordService passwordService;
    private final EmailVerificationService emailVerificationService;
    private final UserIdExtractor userIdExtractor;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        String userId = userIdExtractor.extractUserId(authHeader);
        User user = authService.getUserById(userId);
        String token = authHeader.substring(7); // Keep token for response

        return ResponseEntity.ok(userMapper.toAuthResponse(user,token));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordService.initiatePasswordReset(request.getEmail());
        return ResponseEntity.ok(new MessageResponse(AppConstants.SUCCESS_PASSWORD_RESET_SENT));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(new MessageResponse(AppConstants.SUCCESS_PASSWORD_RESET));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        emailVerificationService.verifyEmail(request.getToken());
        return ResponseEntity.ok(new MessageResponse(AppConstants.SUCCESS_EMAIL_VERIFIED));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<MessageResponse> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        emailVerificationService.resendVerificationEmail(request.getEmail());
        return ResponseEntity.ok(new MessageResponse(AppConstants.SUCCESS_VERIFICATION_SENT));
    }

    @PostMapping("/deactivate-account")
    public ResponseEntity<MessageResponse> deactivateAccount(@RequestHeader("Authorization") String authHeader) {
        String userId = userIdExtractor.extractUserId(authHeader);
        authService.requestAccountDeactivation(userId);
        return ResponseEntity.ok(new MessageResponse(AppConstants.SUCCESS_DEACTIVATION_REQUESTED));
    }

    @PostMapping("/cancel-deactivation")
    public ResponseEntity<MessageResponse> cancelDeactivation(@RequestHeader("Authorization") String authHeader) {
        String userId = userIdExtractor.extractUserId(authHeader);
        authService.cancelAccountDeactivation(userId);
        return ResponseEntity.ok(new MessageResponse(AppConstants.SUCCESS_DEACTIVATION_CANCELLED));
    }
}