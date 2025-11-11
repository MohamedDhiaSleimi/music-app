package com.musicapp.auth_service.controler;

import com.musicapp.auth_service.dto.AuthResponse;
import com.musicapp.auth_service.dto.OAuth2UserInfo;
import com.musicapp.auth_service.service.OAuth2Service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/oauth2")
@RequiredArgsConstructor
public class OAuth2Controller {

    private final OAuth2Service oAuth2Service;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @GetMapping("/google/callback")
    public ResponseEntity<?> googleCallback(OAuth2AuthenticationToken authentication) {
        try {
            Map<String, Object> attributes = authentication.getPrincipal().getAttributes();

            OAuth2UserInfo userInfo = new OAuth2UserInfo();
            userInfo.setId((String) attributes.get("sub"));
            userInfo.setEmail((String) attributes.get("email"));
            userInfo.setName((String) attributes.get("name"));
            userInfo.setPicture((String) attributes.get("picture"));

            AuthResponse response = oAuth2Service.processOAuth2User(userInfo, "google");

            // Redirect to frontend with token
            String redirectUrl = frontendUrl + "/auth/callback?token=" + response.getToken() +
                    "&userId=" + response.getUserId() +
                    "&email=" + response.getEmail() +
                    "&username=" + response.getUsername() +
                    "&profileImageUrl=" + (response.getProfileImageUrl() != null ? response.getProfileImageUrl() : "");

            return ResponseEntity.status(302)
                    .header("Location", redirectUrl)
                    .build();
        } catch (Exception e) {
            return ResponseEntity.status(302)
                    .header("Location", frontendUrl + "/login?error=" + e.getMessage())
                    .build();
        }
    }
}