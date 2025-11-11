package com.musicapp.auth_service.service;

import com.musicapp.auth_service.dto.AuthResponse;
import com.musicapp.auth_service.dto.OAuth2UserInfo;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import com.musicapp.auth_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OAuth2Service {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthResponse processOAuth2User(OAuth2UserInfo userInfo, String provider) {
        // Check if user already exists with this provider
        User user = userRepository.findByProviderAndProviderId(provider, userInfo.getId())
                .orElseGet(() -> {
                    // Check if user exists with same email but different provider
                    return userRepository.findByEmail(userInfo.getEmail())
                            .map(existingUser -> {
                                // Link this OAuth account to existing user
                                existingUser.setProvider(provider);
                                existingUser.setProviderId(userInfo.getId());
                                return existingUser;
                            })
                            .orElseGet(() -> {
                                // Create new user
                                User newUser = new User();
                                newUser.setEmail(userInfo.getEmail());
                                newUser.setProfileImageUrl(userInfo.getPicture());
                                newUser.setProvider(provider);
                                newUser.setProviderId(userInfo.getId());
                                newUser.setEmailVerified(true);
                                newUser.setCreatedAt(LocalDateTime.now());
                                newUser.setActive(true);

                                // Generate username from email
                                String username = userInfo.getEmail().split("@")[0];
                                String uniqueUsername = generateUniqueUsername(username);
                                newUser.setUsername(uniqueUsername);

                                return newUser;
                            });
                });

        // Update last login and profile image
        user.setLastLogin(LocalDateTime.now());
        if (userInfo.getPicture() != null) {
            user.setProfileImageUrl(userInfo.getPicture());
        }

        user = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getProfileImageUrl()
        );
    }

    private String generateUniqueUsername(String baseUsername) {
        String username = baseUsername.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();

        if (username.length() < 3) {
            username = "user" + username;
        }

        if (!userRepository.existsByUsername(username)) {
            return username;
        }

        // Add numbers until we find a unique username
        int counter = 1;
        String newUsername = username + counter;
        while (userRepository.existsByUsername(newUsername)) {
            counter++;
            newUsername = username + counter;
        }

        return newUsername;
    }
}