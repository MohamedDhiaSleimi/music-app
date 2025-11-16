package com.musicapp.auth_service.service;

import com.musicapp.auth_service.constants.AppConstants;
import com.musicapp.auth_service.exception.custom.*;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${password.reset.token.expiration}")
    private Long tokenExpiration;

    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));

        if (user.getProvider() != null && !user.getProvider().equals(AppConstants.PROVIDER_LOCAL)) {
            throw new RuntimeException(AppConstants.ERROR_OAUTH_PASSWORD_RESET);
        }

        if (!user.isActive()) {
            throw new AccountDeactivatedException(AppConstants.ERROR_ACCOUNT_DEACTIVATED);
        }

        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusSeconds(tokenExpiration / 1000));

        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), resetToken, user.getUsername());
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (user.getPasswordResetTokenExpiry() == null ||
                user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);

        userRepository.save(user);
    }
}