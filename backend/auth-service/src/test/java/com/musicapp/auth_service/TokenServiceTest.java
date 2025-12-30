package com.musicapp.auth_service;

import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.service.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class TokenServiceTest {

    @InjectMocks
    private TokenService tokenService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId("test-id");
        testUser.setEmail("test@example.com");

        // Set expiration values (in milliseconds)
        ReflectionTestUtils.setField(tokenService, "passwordResetExpiration", 3600000L);
        ReflectionTestUtils.setField(tokenService, "emailVerificationExpiration", 86400000L);
    }

    @Test
    void generatePasswordResetToken_ShouldSetTokenAndExpiry() {
        // Act
        String token = tokenService.generatePasswordResetToken(testUser);

        // Assert
        assertNotNull(token);
        assertEquals(token, testUser.getPasswordResetToken());
        assertNotNull(testUser.getPasswordResetTokenExpiry());
        assertTrue(testUser.getPasswordResetTokenExpiry().isAfter(LocalDateTime.now()));
    }

    @Test
    void generateEmailVerificationToken_ShouldSetTokenAndExpiry() {
        // Act
        String token = tokenService.generateEmailVerificationToken(testUser);

        // Assert
        assertNotNull(token);
        assertEquals(token, testUser.getEmailVerificationToken());
        assertNotNull(testUser.getEmailVerificationTokenExpiry());
        assertTrue(testUser.getEmailVerificationTokenExpiry().isAfter(LocalDateTime.now()));
    }

    @Test
    void isPasswordResetTokenValid_WithValidToken_ShouldReturnTrue() {
        // Arrange
        testUser.setPasswordResetToken("valid-token");
        testUser.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1));

        // Act & Assert
        assertTrue(tokenService.isPasswordResetTokenValid(testUser));
    }

    @Test
    void isPasswordResetTokenValid_WithExpiredToken_ShouldReturnFalse() {
        // Arrange
        testUser.setPasswordResetToken("expired-token");
        testUser.setPasswordResetTokenExpiry(LocalDateTime.now().minusHours(1));

        // Act & Assert
        assertFalse(tokenService.isPasswordResetTokenValid(testUser));
    }

    @Test
    void clearPasswordResetToken_ShouldRemoveTokenAndExpiry() {
        // Arrange
        testUser.setPasswordResetToken("token");
        testUser.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1));

        // Act
        tokenService.clearPasswordResetToken(testUser);

        // Assert
        assertNull(testUser.getPasswordResetToken());
        assertNull(testUser.getPasswordResetTokenExpiry());
    }
}