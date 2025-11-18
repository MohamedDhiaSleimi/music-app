package com.musicapp.auth_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    // ADD base method:
    private void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        try {
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    public void sendEmailVerification(String toEmail, String verificationToken, String username) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + verificationToken;

        String emailBody = String.format(
                "Hi %s,\n\n" +
                        "Welcome to Music App! 🎵\n\n" +
                        "Please verify your email address by clicking the link below:\n%s\n\n" +
                        "This link will expire in 24 hours.\n\n" +
                        "If you didn't create this account, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "Music App Team 🎵",
                username,
                verificationUrl
        );

        sendEmail(toEmail, "🎵 Verify Your Music App Email", emailBody);
    }

    public void sendPasswordResetEmail(String toEmail, String resetToken, String username) {
        String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;

        String emailBody = String.format(
                "Hi %s,\n\n" +
                        "We received a request to reset your password for your Music App account.\n\n" +
                        "Click the link below to reset your password:\n%s\n\n" +
                        "This link will expire in 1 hour.\n\n" +
                        "If you didn't request this, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "Music App Team 🎵",
                username,
                resetUrl
        );

        sendEmail(toEmail, "🎵 Reset Your Music App Password", emailBody);
    }

    public void sendAccountDeactivationEmail(String toEmail, String username) {
        String emailBody = String.format(
                "Hi %s,\n\n" +
                        "Your Music App account deactivation request has been received.\n\n" +
                        "Your account will be permanently deactivated in 7 days.\n" +
                        "If you change your mind, simply log in within this period to cancel the deactivation.\n\n" +
                        "After 7 days, you will no longer be able to access your account.\n\n" +
                        "We're sad to see you go! 😢\n\n" +
                        "Best regards,\n" +
                        "Music App Team 🎵",
                username
        );

        sendEmail(toEmail, "🎵 Account Deactivation Confirmation", emailBody);
    }
}