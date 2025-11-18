package com.musicapp.auth_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true, sparse = true)
    private String username;

    private String password;

    private String profileImageUrl;

    private AccountStatus status = AccountStatus.PENDING_VERIFICATION;

    private LocalDateTime createdAt;

    private LocalDateTime lastLogin;

    private String provider;

    private String providerId;

    // Password Reset Fields
    private String passwordResetToken;

    private LocalDateTime passwordResetTokenExpiry;

    private LocalDateTime deactivationRequestedAt;

    private LocalDateTime deactivatedAt;

    // Email Verification Fields
    private String emailVerificationToken;

    private LocalDateTime emailVerificationTokenExpiry;



    @Deprecated
    public boolean isEmailVerified() {
        return status.isVerified();
    }

    @Deprecated
    public boolean isActive() {
        return status.isActive();
    }

    @Deprecated
    public void setEmailVerified(boolean emailVerified) {
        if (emailVerified && status == AccountStatus.PENDING_VERIFICATION) {
            status = AccountStatus.ACTIVE;
        }
    }

    @Deprecated
    public void setActive(boolean active) {
        if (!active && status.canLogin()) {
            status = AccountStatus.DEACTIVATED;
        }
    }

}