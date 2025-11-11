package com.musicapp.auth_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

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

    private boolean emailVerified = false;

    private LocalDateTime createdAt;

    private LocalDateTime lastLogin;

    private boolean active = true;

    private String provider;

    private String providerId;

    // Password Reset Fields
    private String passwordResetToken;

    private LocalDateTime passwordResetTokenExpiry;

    // Account Deactivation Fields
    private boolean deactivated = false;

    private LocalDateTime deactivationRequestedAt;

    private LocalDateTime deactivatedAt;
}