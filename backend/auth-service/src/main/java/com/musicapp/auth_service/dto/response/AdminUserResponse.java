package com.musicapp.auth_service.dto.response;

import com.musicapp.auth_service.model.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AdminUserResponse {
    private String userId;
    private String email;
    private String username;
    private String profileImageUrl;
    private AccountStatus status;
    private String provider;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}
