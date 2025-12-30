package com.musicapp.auth_service.model;

public enum AccountStatus {
    PENDING_VERIFICATION,    // Newly registered, email not verified
    ACTIVE,                  // Email verified and account active
    DEACTIVATION_PENDING,    // Deactivation requested, within grace period
    DEACTIVATED;             // Permanently deactivated

    public boolean isActive() {
        return this == ACTIVE || this == PENDING_VERIFICATION || this == DEACTIVATION_PENDING;
    }

    public boolean isVerified() {
        return this == ACTIVE || this == DEACTIVATION_PENDING || this == DEACTIVATED;
    }

    public boolean canLogin() {
        return this == ACTIVE || this == PENDING_VERIFICATION || this == DEACTIVATION_PENDING;
    }
}