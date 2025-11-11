package com.musicapp.auth_service.service;

import com.musicapp.auth_service.dto.AuthResponse;
import com.musicapp.auth_service.dto.LoginRequest;
import com.musicapp.auth_service.dto.RegisterRequest;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import com.musicapp.auth_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);

        // Save user
        user = userRepository.save(user);

        // Generate token
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
        // Find user by email or username
        User user = userRepository.findByEmailOrUsername(
                request.getEmailOrUsername(),
                request.getEmailOrUsername()
        ).orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Check if user is active
        if (!user.isActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Generate token
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
}