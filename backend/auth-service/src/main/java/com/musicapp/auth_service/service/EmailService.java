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

    public void sendEmailVerification(String toEmail, String verificationToken, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("🎵 Verify Your Music App Email");

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

        message.setText(emailBody);

        try {
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send verification email: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String toEmail, String resetToken, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("🎵 Reset Your Music App Password");

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

        message.setText(emailBody);

        try {
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    public void sendAccountDeactivationEmail(String toEmail, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("🎵 Account Deactivation Confirmation");

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

        message.setText(emailBody);

        try {
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
}