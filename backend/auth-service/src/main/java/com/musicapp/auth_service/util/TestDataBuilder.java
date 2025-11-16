package com.musicapp.auth_service.util;

import com.musicapp.auth_service.dto.request.LoginRequest;
import com.musicapp.auth_service.dto.request.RegisterRequest;
import com.musicapp.auth_service.model.User;

import java.time.LocalDateTime;

public class TestDataBuilder {

    public static User createTestUser() {
        User user = new User();
        user.setId("test-user-id");
        user.setEmail("test@example.com");
        user.setUsername("testuser");
        user.setPassword("$2a$10$encrypted-password");
        user.setActive(true);
        user.setProvider("local");
        user.setEmailVerified(false);
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }

    public static RegisterRequest createRegisterRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@example.com");
        request.setUsername("newuser");
        request.setPassword("password123");
        return request;
    }

    public static LoginRequest createLoginRequest() {
        LoginRequest request = new LoginRequest();
        request.setEmailOrUsername("test@example.com");
        request.setPassword("password123");
        return request;
    }
}