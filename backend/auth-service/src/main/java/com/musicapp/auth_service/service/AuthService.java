package com.musicapp.auth_service.service;

import com.musicapp.auth_service.constants.AppConstants;
import com.musicapp.auth_service.dto.response.AuthResponse;
import com.musicapp.auth_service.dto.request.LoginRequest;
import com.musicapp.auth_service.dto.request.RegisterRequest;
import com.musicapp.auth_service.exception.custom.*;
import com.musicapp.auth_service.mapper.UserMapper;
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
    private final UserMapper userMapper;

    @Value("${password.reset.grace.period}")
    private Long gracePeriod;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(AppConstants.ERROR_EMAIL_EXISTS);
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException(AppConstants.ERROR_USERNAME_EXISTS);
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        user.setProvider(AppConstants.PROVIDER_LOCAL);

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return userMapper.toAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailOrUsername(
                request.getEmailOrUsername(),
                request.getEmailOrUsername()
        ).orElseThrow(() -> new InvalidCredentialsException(AppConstants.ERROR_INVALID_CREDENTIALS));

        if (!user.isActive()) {
            throw new AccountDeactivatedException(AppConstants.ERROR_ACCOUNT_DEACTIVATED);
        }

        if (user.getPassword() == null) {
            throw new InvalidCredentialsException(AppConstants.ERROR_OAUTH_LOGIN_REQUIRED);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException(AppConstants.ERROR_INVALID_CREDENTIALS);
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

        return userMapper.toAuthResponse(user, token);
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));
    }

    public void requestAccountDeactivation(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));

        if (!user.isActive()) {
            throw new AccountDeactivatedException(AppConstants.ERROR_ACCOUNT_DEACTIVATED);
        }

        user.setDeactivationRequestedAt(LocalDateTime.now());
        userRepository.save(user);

        emailService.sendAccountDeactivationEmail(user.getEmail(), user.getUsername());
    }

    public void cancelAccountDeactivation(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));

        if (user.getDeactivationRequestedAt() == null) {
            throw new RuntimeException(AppConstants.ERROR_NO_DEACTIVATION_REQUEST);
        }

        user.setDeactivationRequestedAt(null);
        userRepository.save(user);
    }
}