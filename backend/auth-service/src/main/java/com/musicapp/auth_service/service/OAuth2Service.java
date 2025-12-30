package com.musicapp.auth_service.service;

import com.musicapp.auth_service.constants.AppConstants;
import com.musicapp.auth_service.dto.response.AuthResponse;
import com.musicapp.auth_service.dto.response.OAuth2UserInfo;
import com.musicapp.auth_service.mapper.UserMapper;
import com.musicapp.auth_service.model.AccountStatus;
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
    private final UserMapper userMapper;

    public AuthResponse processOAuth2User(OAuth2UserInfo userInfo, String provider) {
        User user = userRepository.findByProviderAndProviderId(provider, userInfo.getId())
                .orElseGet(() -> userRepository.findByEmail(userInfo.getEmail())
                        .map(existingUser -> {
                            existingUser.setProvider(provider);
                            existingUser.setProviderId(userInfo.getId());
                            if (existingUser.getStatus() == AccountStatus.PENDING_VERIFICATION) {
                                existingUser.setStatus(AccountStatus.ACTIVE);
                            }
                            return existingUser;
                        })
                        .orElseGet(() -> {
                            User newUser = new User();
                            newUser.setEmail(userInfo.getEmail());
                            newUser.setProfileImageUrl(userInfo.getPicture());
                            newUser.setProvider(provider);
                            newUser.setProviderId(userInfo.getId());
                            newUser.setCreatedAt(LocalDateTime.now());
                            newUser.setStatus(AccountStatus.ACTIVE);

                            String username = userInfo.getEmail().split("@")[0];
                            String uniqueUsername = generateUniqueUsername(username);
                            newUser.setUsername(uniqueUsername);

                            return newUser;
                        }));

        user.setLastLogin(LocalDateTime.now());
        if (userInfo.getPicture() != null) {
            user.setProfileImageUrl(userInfo.getPicture());
        }

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return userMapper.toAuthResponse(user,token);
    }

    private String generateUniqueUsername(String baseUsername) {
        String username = baseUsername.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();

        if (username.length() < AppConstants.USERNAME_MIN_LENGTH) {
            username = AppConstants.USERNAME_PREFIX + username;
        }

        if (!userRepository.existsByUsername(username)) {
            return username;
        }

        int counter = 1;
        String newUsername = username + counter;
        while (userRepository.existsByUsername(newUsername)) {
            counter++;
            newUsername = username + counter;
        }

        return newUsername;
    }
}