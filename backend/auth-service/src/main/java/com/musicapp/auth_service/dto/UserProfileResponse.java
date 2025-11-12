package com.musicapp.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserProfileResponse {
    private String userId;
    private String email;
    private String username;
    private String profileImageUrl;
    private boolean emailVerified;
    private String provider;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}