package com.musicapp.auth_service.util;

import com.musicapp.auth_service.constants.AppConstants;
import com.musicapp.auth_service.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserIdExtractor {

    private final JwtUtil jwtUtil;

    public String extractUserId(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith(AppConstants.BEARER_PREFIX)) {
            throw new RuntimeException("Invalid authorization header");
        }
        String token = authorizationHeader.substring(7);
        return jwtUtil.getUserIdFromToken(token);
    }
}