package com.musicapp.auth_service.util;

import com.musicapp.auth_service.constants.AppConstants;
import com.musicapp.auth_service.exception.custom.AccountDeactivatedException;
import com.musicapp.auth_service.model.AccountStatus;
import com.musicapp.auth_service.model.User;
import org.springframework.stereotype.Component;

@Component
public class ValidationUtil {

    public void validateUserActive(User user) {
        if (user.getStatus() == AccountStatus.DEACTIVATED) {
            throw new AccountDeactivatedException(AppConstants.ERROR_ACCOUNT_DEACTIVATED);
        }
    }

    public void validateUserNotVerified(User user) {
        if (user.getStatus().isVerified()) {
            throw new RuntimeException(AppConstants.ERROR_EMAIL_VERIFIED);
        }
    }

    public void validateLocalProvider(User user) {
        if (user.getProvider() != null && !user.getProvider().equals(AppConstants.PROVIDER_LOCAL)) {
            throw new RuntimeException(AppConstants.ERROR_OAUTH_PASSWORD_RESET);
        }
    }

    public void validateOAuthProvider(User user) {
        if (user.getProvider() != null && !user.getProvider().equals(AppConstants.PROVIDER_LOCAL)) {
            throw new RuntimeException(AppConstants.ERROR_OAUTH_VERIFICATION);
        }
    }

    public void validateUserCanLogin(User user) {
        if (!user.getStatus().canLogin()) {
            throw new AccountDeactivatedException(AppConstants.ERROR_ACCOUNT_DEACTIVATED);
        }
    }
}