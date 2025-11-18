package com.musicapp.auth_service.service;

import com.musicapp.auth_service.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenService {

    @Value("${password.reset.token.expiration}")
    private Long passwordResetExpiration;

    @Value("${email.verification.token.expiration}")
    private Long emailVerificationExpiration;

    public String generatePasswordResetToken(User user) {
        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(
                LocalDateTime.now().plusSeconds(passwordResetExpiration / 1000)
        );
        return token;
    }

    public String generateEmailVerificationToken(User user) {
        String token = UUID.randomUUID().toString();
        user.setEmailVerificationToken(token);
        user.setEmailVerificationTokenExpiry(
                LocalDateTime.now().plusSeconds(emailVerificationExpiration / 1000)
        );
        return token;
    }

    public boolean isPasswordResetTokenValid(User user) {
        return user.getPasswordResetToken() != null &&
                user.getPasswordResetTokenExpiry() != null &&
                user.getPasswordResetTokenExpiry().isAfter(LocalDateTime.now());
    }

    public boolean isEmailVerificationTokenValid(User user) {
        return user.getEmailVerificationToken() != null &&
                user.getEmailVerificationTokenExpiry() != null &&
                user.getEmailVerificationTokenExpiry().isAfter(LocalDateTime.now());
    }

    public void clearPasswordResetToken(User user) {
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
    }

    public void clearEmailVerificationToken(User user) {
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiry(null);
    }
}