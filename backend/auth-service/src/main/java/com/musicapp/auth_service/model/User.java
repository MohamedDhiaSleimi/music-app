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

    @Indexed(unique = true, sparse = true)  // Changed: sparse allows null values
    private String username;

    private String password;  // Can be null for OAuth users

    private String profileImageUrl;

    private boolean emailVerified = false;

    private LocalDateTime createdAt;

    private LocalDateTime lastLogin;

    private boolean active = true;

    // NEW: OAuth fields
    private String provider;  // "local", "google", etc.

    private String providerId;  // Google user ID
}