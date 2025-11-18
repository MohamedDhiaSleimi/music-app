package com.musicapp.auth_service.mapper;

import com.musicapp.auth_service.dto.response.AuthResponse;
import com.musicapp.auth_service.dto.response.UserProfileResponse;
import com.musicapp.auth_service.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserProfileResponse toUserProfileResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getProfileImageUrl(),
                user.getStatus().isVerified(),  // CHANGED
                user.getProvider(),
                user.getCreatedAt(),
                user.getLastLogin()
        );
    }

    public AuthResponse toAuthResponse(User user, String token) {
        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getProfileImageUrl()
        );
    }
}