package com.musicapp.auth_service.service;

import com.musicapp.auth_service.dto.AuthResponse;
import com.musicapp.auth_service.dto.LoginRequest;
import com.musicapp.auth_service.dto.RegisterRequest;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import com.musicapp.auth_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    @Value("${password.reset.grace.period}")
    private Long gracePeriod;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        user.setProvider("local");

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getProfileImageUrl()
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailOrUsername(
                request.getEmailOrUsername(),
                request.getEmailOrUsername()
        ).orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        if (user.isDeactivated()) {
            throw new RuntimeException("Account has been deactivated");
        }

        if (user.getPassword() == null) {
            throw new RuntimeException("Please use OAuth login");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Cancel deactivation if within grace period
        if (user.getDeactivationRequestedAt() != null) {
            LocalDateTime gracePeriodEnd = user.getDeactivationRequestedAt()
                    .plusSeconds(gracePeriod / 1000);

            if (LocalDateTime.now().isBefore(gracePeriodEnd)) {
                user.setDeactivationRequestedAt(null);
            }
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getProfileImageUrl()
        );
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void requestAccountDeactivation(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isDeactivated()) {
            throw new RuntimeException("Account is already deactivated");
        }

        user.setDeactivationRequestedAt(LocalDateTime.now());
        userRepository.save(user);

        emailService.sendAccountDeactivationEmail(user.getEmail(), user.getUsername());
    }

    public void cancelAccountDeactivation(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getDeactivationRequestedAt() == null) {
            throw new RuntimeException("No deactivation request found");
        }

        user.setDeactivationRequestedAt(null);
        userRepository.save(user);
    }
}