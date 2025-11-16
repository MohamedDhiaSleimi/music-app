package com.musicapp.auth_service.service;

import com.musicapp.auth_service.constants.AppConstants;
import com.musicapp.auth_service.dto.response.UserProfileResponse;
import com.musicapp.auth_service.exception.custom.UsernameAlreadyExistsException;
import com.musicapp.auth_service.exception.custom.UserNotFoundException;
import com.musicapp.auth_service.mapper.UserMapper;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserProfileResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));

        return userMapper.toUserProfileResponse(user);

    }

    public UserProfileResponse updateUsername(String userId, String newUsername) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));

        // Check if username is already taken
        if (userRepository.existsByUsername(newUsername)) {
            // Check if it's not the same user
            User existingUser = userRepository.findByUsername(newUsername).orElse(null);
            if (existingUser != null && !existingUser.getId().equals(userId)) {
                throw new UsernameAlreadyExistsException("Username already taken");
            }
        }

        user.setUsername(newUsername);
        user = userRepository.save(user);

        return userMapper.toUserProfileResponse(user);
    }

    public UserProfileResponse updateProfilePhoto(String userId, String profilePhotoUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));

        user.setProfileImageUrl(profilePhotoUrl);
        user = userRepository.save(user);

        return userMapper.toUserProfileResponse(user);
    }

    public UserProfileResponse removeProfilePhoto(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(AppConstants.ERROR_USER_NOT_FOUND));

        user.setProfileImageUrl(null);
        user = userRepository.save(user);

        return userMapper.toUserProfileResponse(user);
    }
}