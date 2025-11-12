package com.musicapp.auth_service.service;

import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${email.verification.token.expiration}")
    private Long tokenExpiration;

    public void sendVerificationEmail(User user) {
        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusSeconds(tokenExpiration / 1000));

        userRepository.save(user);

        emailService.sendEmailVerification(user.getEmail(), verificationToken, user.getUsername());
    }

    public void verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (user.getEmailVerificationTokenExpiry() == null ||
                user.getEmailVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token has expired");
        }

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiry(null);

        userRepository.save(user);
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        sendVerificationEmail(user);
    }

    public void requestVerificationForExistingUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        // OAuth users don't need email verification
        if (user.getProvider() != null && !user.getProvider().equals("local")) {
            throw new RuntimeException("OAuth accounts don't require email verification");
        }

        sendVerificationEmail(user);
    }
}