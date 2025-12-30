package com.musicapp.auth_service.service;

import com.musicapp.auth_service.constants.AppConstants;
import com.musicapp.auth_service.exception.custom.TokenExpiredException;
import com.musicapp.auth_service.exception.custom.UserNotFoundException;
import com.musicapp.auth_service.model.AccountStatus;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import com.musicapp.auth_service.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final TokenService tokenService;
    private final ValidationUtil validationUtil;


    public void sendVerificationEmail(User user) {
        String verificationToken = tokenService.generateEmailVerificationToken(user);
        userRepository.save(user);

        emailService.sendEmailVerification(user.getEmail(), verificationToken, user.getUsername());
    }

    public void verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token).orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (!tokenService.isEmailVerificationTokenValid(user)) {
            throw new TokenExpiredException("Verification token has expired");
        }

        validationUtil.validateUserNotVerified(user);

        user.setStatus(AccountStatus.ACTIVE);
        tokenService.clearEmailVerificationToken(user);
        userRepository.save(user);
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));

        validationUtil.validateUserNotVerified(user);
        validationUtil.validateUserActive(user);

        sendVerificationEmail(user);
    }

    public void requestVerificationForExistingUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));

        validationUtil.validateUserNotVerified(user);
        validationUtil.validateUserActive(user);
        validationUtil.validateNotOAuthProvider(user);

        sendVerificationEmail(user);
    }
}
