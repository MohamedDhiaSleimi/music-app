package com.musicapp.auth_service.service;

import com.musicapp.auth_service.constants.AppConstants;
import com.musicapp.auth_service.dto.request.LoginRequest;
import com.musicapp.auth_service.dto.request.RegisterRequest;
import com.musicapp.auth_service.dto.response.AuthResponse;
import com.musicapp.auth_service.exception.custom.EmailAlreadyExistsException;
import com.musicapp.auth_service.exception.custom.InvalidCredentialsException;
import com.musicapp.auth_service.exception.custom.UserNotFoundException;
import com.musicapp.auth_service.exception.custom.UsernameAlreadyExistsException;
import com.musicapp.auth_service.mapper.UserMapper;
import com.musicapp.auth_service.model.AccountStatus;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import com.musicapp.auth_service.security.JwtUtil;
import com.musicapp.auth_service.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
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
    private final ValidationUtil validationUtil;  // ADD

    @Value("${password.reset.grace.period}")
    private Long gracePeriod;

    @CacheEvict(value = "users", key = "#result.userId")
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailOrUsername(request.getEmailOrUsername(), request.getEmailOrUsername()).orElseThrow(() -> new InvalidCredentialsException(AppConstants.ERROR_INVALID_CREDENTIALS));

        // REPLACE validation WITH:
        validationUtil.validateUserCanLogin(user);


        if (user.getPassword() == null) {
            throw new InvalidCredentialsException(AppConstants.ERROR_OAUTH_LOGIN_REQUIRED);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException(AppConstants.ERROR_INVALID_CREDENTIALS);
        }

        // Cancel deactivation if within grace period
        if (user.getStatus() == AccountStatus.DEACTIVATION_PENDING) {
            LocalDateTime gracePeriodEnd = user.getDeactivationRequestedAt().plusSeconds(gracePeriod / 1000);
            if (LocalDateTime.now().isBefore(gracePeriodEnd)) {
                user.setDeactivationRequestedAt(null);
                user.setStatus(user.getStatus().isVerified() ? AccountStatus.ACTIVE : AccountStatus.PENDING_VERIFICATION);
            }
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return userMapper.toAuthResponse(user, token);
    }

    @CacheEvict(value = "users", key = "#result.userId")
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
        user.setStatus(AccountStatus.PENDING_VERIFICATION);
        user.setProvider(AppConstants.PROVIDER_LOCAL);

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return userMapper.toAuthResponse(user, token);
    }

    @CacheEvict(value = "users", key = "#userId")
    public void requestAccountDeactivation(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));

        // REPLACE validation WITH:
        validationUtil.validateUserActive(user);

        user.setDeactivationRequestedAt(LocalDateTime.now());
        user.setStatus(AccountStatus.DEACTIVATION_PENDING);
        userRepository.save(user);
        emailService.sendAccountDeactivationEmail(user.getEmail(), user.getUsername());
    }

    @CacheEvict(value = "users", key = "#userId")
    public void cancelAccountDeactivation(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));

        if (user.getDeactivationRequestedAt() == null) {
            throw new RuntimeException(AppConstants.ERROR_NO_DEACTIVATION_REQUEST);
        }
        user.setStatus(user.getStatus().isVerified() ? AccountStatus.ACTIVE : AccountStatus.PENDING_VERIFICATION);
        user.setDeactivationRequestedAt(null);
        userRepository.save(user);
    }

    @Cacheable(value = "users", key = "#userId")
    public User getUserById(String userId) {
        return userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));
    }

}
