package com.musicapp.auth_service.service;

import com.musicapp.auth_service.dto.response.UserProfileResponse;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;

    public UserProfileResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getProfileImageUrl(),
                user.isEmailVerified(),
                user.getProvider(),
                user.getCreatedAt(),
                user.getLastLogin()
        );
    }

    public UserProfileResponse updateUsername(String userId, String newUsername) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if username is already taken
        if (userRepository.existsByUsername(newUsername)) {
            // Check if it's not the same user
            User existingUser = userRepository.findByUsername(newUsername).orElse(null);
            if (existingUser != null && !existingUser.getId().equals(userId)) {
                throw new RuntimeException("Username already taken");
            }
        }

        user.setUsername(newUsername);
        user = userRepository.save(user);

        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getProfileImageUrl(),
                user.isEmailVerified(),
                user.getProvider(),
                user.getCreatedAt(),
                user.getLastLogin()
        );
    }

    public UserProfileResponse updateProfilePhoto(String userId, String profilePhotoUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setProfileImageUrl(profilePhotoUrl);
        user = userRepository.save(user);

        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getProfileImageUrl(),
                user.isEmailVerified(),
                user.getProvider(),
                user.getCreatedAt(),
                user.getLastLogin()
        );
    }

    public UserProfileResponse removeProfilePhoto(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setProfileImageUrl(null);
        user = userRepository.save(user);

        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getProfileImageUrl(),
                user.isEmailVerified(),
                user.getProvider(),
                user.getCreatedAt(),
                user.getLastLogin()
        );
    }
}