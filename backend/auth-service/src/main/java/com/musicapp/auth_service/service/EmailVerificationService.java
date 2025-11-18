package com.musicapp.auth_service.service;

import com.musicapp.auth_service.constants.AppConstants;
import com.musicapp.auth_service.exception.custom.AccountDeactivatedException;
import com.musicapp.auth_service.exception.custom.TokenExpiredException;
import com.musicapp.auth_service.exception.custom.UserNotFoundException;
import com.musicapp.auth_service.model.AccountStatus;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final TokenService tokenService;


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

        if (user.getStatus().isVerified()) {
            throw new RuntimeException(AppConstants.ERROR_EMAIL_VERIFIED);
        }

        user.setStatus(AccountStatus.ACTIVE);
        tokenService.clearEmailVerificationToken(user);
        userRepository.save(user);
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));

        if (user.getStatus().isVerified()) {
            throw new RuntimeException(AppConstants.ERROR_EMAIL_VERIFIED);
        }
        if (user.getStatus() == AccountStatus.DEACTIVATED) {
            throw new AccountDeactivatedException(AppConstants.ERROR_ACCOUNT_DEACTIVATED);
        }

        sendVerificationEmail(user);
    }

    public void requestVerificationForExistingUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));

        if (user.getStatus().isVerified()) {
            throw new RuntimeException(AppConstants.ERROR_EMAIL_VERIFIED);
        }
        if (user.getStatus() == AccountStatus.DEACTIVATED) {
            throw new AccountDeactivatedException(AppConstants.ERROR_ACCOUNT_DEACTIVATED);
        }

        if (user.getProvider() != null && !user.getProvider().equals(AppConstants.PROVIDER_LOCAL)) {
            throw new RuntimeException(AppConstants.ERROR_OAUTH_VERIFICATION);
        }

        sendVerificationEmail(user);
    }
}
