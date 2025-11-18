package com.musicapp.auth_service.service;

import com.musicapp.auth_service.constants.AppConstants;
import com.musicapp.auth_service.exception.custom.AccountDeactivatedException;
import com.musicapp.auth_service.exception.custom.TokenExpiredException;
import com.musicapp.auth_service.exception.custom.UserNotFoundException;
import com.musicapp.auth_service.model.AccountStatus;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import com.musicapp.auth_service.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class PasswordService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final TokenService tokenService;
    private final ValidationUtil validationUtil;  // ADD

    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(userRepository.findAll().toString()));

        // REPLACE validation logic WITH:
        validationUtil.validateLocalProvider(user);
        validationUtil.validateUserActive(user);

        String resetToken = tokenService.generatePasswordResetToken(user);
        userRepository.save(user);
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken, user.getUsername());
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token).orElseThrow(() -> new RuntimeException("Invalid reset token"));

        // REPLACE expiry check WITH:
        if (!tokenService.isPasswordResetTokenValid(user)) {
            throw new TokenExpiredException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        tokenService.clearPasswordResetToken(user);
        userRepository.save(user);
    }
}