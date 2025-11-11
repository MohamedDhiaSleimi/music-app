package com.musicapp.auth_service.security;

import com.musicapp.auth_service.dto.AuthResponse;
import com.musicapp.auth_service.dto.OAuth2UserInfo;
import com.musicapp.auth_service.service.OAuth2Service;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final OAuth2Service oAuth2Service;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {

        try {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User oAuth2User = oauthToken.getPrincipal();

            String registrationId = oauthToken.getAuthorizedClientRegistrationId();

            // Extract user info from OAuth2User
            Map<String, Object> attributes = oAuth2User.getAttributes();

            OAuth2UserInfo userInfo = new OAuth2UserInfo();
            userInfo.setId((String) attributes.get("sub"));
            userInfo.setEmail((String) attributes.get("email"));
            userInfo.setName((String) attributes.get("name"));
            userInfo.setPicture((String) attributes.get("picture"));

            // Process OAuth2 user and get auth response
            AuthResponse authResponse = oAuth2Service.processOAuth2User(userInfo, registrationId);

            // Build redirect URL with token and user info
            String targetUrl = frontendUrl + "/auth/callback" + "?token=" + authResponse.getToken() + "&userId=" + authResponse.getUserId() + "&email=" + URLEncoder.encode(authResponse.getEmail(), StandardCharsets.UTF_8) + "&username=" + URLEncoder.encode(authResponse.getUsername(), StandardCharsets.UTF_8) + "&profileImageUrl=" + URLEncoder.encode(authResponse.getProfileImageUrl() != null ? authResponse.getProfileImageUrl() : "", StandardCharsets.UTF_8);

            getRedirectStrategy().sendRedirect(request, response, targetUrl);

        } catch (Exception e) {
            e.printStackTrace();  // Log the actual error

            // Redirect to frontend with error
            String errorUrl = frontendUrl + "/login?error=" + URLEncoder.encode("Authentication failed: " + e.getMessage(), StandardCharsets.UTF_8);

            getRedirectStrategy().sendRedirect(request, response, errorUrl);
        }
    }
}