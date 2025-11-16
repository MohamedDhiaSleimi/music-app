package com.musicapp.auth_service.constants;

public final class AppConstants {

    private AppConstants() {
        // Private constructor to prevent instantiation
    }

    // Provider names
    public static final String PROVIDER_LOCAL = "local";
    public static final String PROVIDER_GOOGLE = "google";

    // Error messages
    public static final String ERROR_USER_NOT_FOUND = "User not found";
    public static final String ERROR_INVALID_CREDENTIALS = "Invalid credentials";
    public static final String ERROR_EMAIL_EXISTS = "Email already exists";
    public static final String ERROR_USERNAME_EXISTS = "Username already exists";
    public static final String ERROR_ACCOUNT_DEACTIVATED = "Account is deactivated";
    public static final String ERROR_EMAIL_VERIFIED = "Email is already verified";
    public static final String ERROR_TOKEN_EXPIRED = "Token has expired";
    public static final String ERROR_INVALID_TOKEN = "Invalid token";
    public static final String ERROR_OAUTH_PASSWORD_RESET = "Cannot reset password for OAuth accounts";
    public static final String ERROR_OAUTH_LOGIN_REQUIRED = "Please use OAuth login";
    public static final String ERROR_OAUTH_VERIFICATION = "OAuth accounts don't require email verification";
    public static final String ERROR_NO_DEACTIVATION_REQUEST = "No deactivation request found";

    // Success messages
    public static final String SUCCESS_PASSWORD_RESET_SENT = "Password reset email sent successfully";
    public static final String SUCCESS_PASSWORD_RESET = "Password reset successfully";
    public static final String SUCCESS_EMAIL_VERIFIED = "Email verified successfully";
    public static final String SUCCESS_VERIFICATION_SENT = "Verification email sent successfully";
    public static final String SUCCESS_DEACTIVATION_REQUESTED = "Account deactivation requested. You have 7 days to cancel.";
    public static final String SUCCESS_DEACTIVATION_CANCELLED = "Account deactivation cancelled";

    // Username generation
    public static final String USERNAME_PREFIX = "user";
    public static final int USERNAME_MIN_LENGTH = 3;

    // Token types
    public static final String BEARER_PREFIX = "Bearer ";
}