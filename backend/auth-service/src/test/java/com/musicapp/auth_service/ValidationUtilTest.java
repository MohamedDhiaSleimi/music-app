package com.musicapp.auth_service;

import com.musicapp.auth_service.exception.custom.AccountDeactivatedException;
import com.musicapp.auth_service.model.AccountStatus;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.util.ValidationUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ValidationUtilTest {

    private ValidationUtil validationUtil;
    private User testUser;

    @BeforeEach
    void setUp() {
        validationUtil = new ValidationUtil();
        testUser = new User();
        testUser.setId("test-id");
        testUser.setEmail("test@example.com");
        testUser.setProvider("local");
    }

    @Test
    void validateUserActive_WithActiveUser_ShouldNotThrow() {
        testUser.setStatus(AccountStatus.ACTIVE);
        assertDoesNotThrow(() -> validationUtil.validateUserActive(testUser));
    }

    @Test
    void validateUserActive_WithDeactivatedUser_ShouldThrow() {
        testUser.setStatus(AccountStatus.DEACTIVATED);
        assertThrows(AccountDeactivatedException.class,
                () -> validationUtil.validateUserActive(testUser));
    }

    @Test
    void validateUserNotVerified_WithPendingUser_ShouldNotThrow() {
        testUser.setStatus(AccountStatus.PENDING_VERIFICATION);
        assertDoesNotThrow(() -> validationUtil.validateUserNotVerified(testUser));
    }

    @Test
    void validateUserNotVerified_WithVerifiedUser_ShouldThrow() {
        testUser.setStatus(AccountStatus.ACTIVE);
        assertThrows(RuntimeException.class,
                () -> validationUtil.validateUserNotVerified(testUser));
    }

    @Test
    void validateLocalProvider_WithLocalUser_ShouldNotThrow() {
        testUser.setProvider("local");
        assertDoesNotThrow(() -> validationUtil.validateLocalProvider(testUser));
    }

    @Test
    void validateLocalProvider_WithOAuthUser_ShouldThrow() {
        testUser.setProvider("google");
        assertThrows(RuntimeException.class,
                () -> validationUtil.validateLocalProvider(testUser));
    }

    @Test
    void validateUserCanLogin_WithActiveUser_ShouldNotThrow() {
        testUser.setStatus(AccountStatus.ACTIVE);
        assertDoesNotThrow(() -> validationUtil.validateUserCanLogin(testUser));
    }

    @Test
    void validateUserCanLogin_WithDeactivatedUser_ShouldThrow() {
        testUser.setStatus(AccountStatus.DEACTIVATED);
        assertThrows(AccountDeactivatedException.class,
                () -> validationUtil.validateUserCanLogin(testUser));
    }
}