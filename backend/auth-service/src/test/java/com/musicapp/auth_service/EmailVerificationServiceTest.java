package com.musicapp.auth_service;

import com.musicapp.auth_service.model.AccountStatus;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import com.musicapp.auth_service.service.EmailService;
import com.musicapp.auth_service.service.EmailVerificationService;
import com.musicapp.auth_service.service.TokenService;
import com.musicapp.auth_service.util.ValidationUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailVerificationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private TokenService tokenService;

    @Mock
    private ValidationUtil validationUtil;

    @InjectMocks
    private EmailVerificationService emailVerificationService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId("u1");
        user.setEmail("user@example.com");
        user.setUsername("user");
        user.setStatus(AccountStatus.PENDING_VERIFICATION);
    }

    @Test
    void sendVerificationEmail_generatesTokenAndSendsMail() {
        when(tokenService.generateEmailVerificationToken(user)).thenReturn("token-123");

        emailVerificationService.sendVerificationEmail(user);

        verify(userRepository).save(user);
        verify(emailService).sendEmailVerification("user@example.com", "token-123", "user");
    }

    @Test
    void verifyEmail_activatesUserWhenTokenValid() {
        user.setEmailVerificationToken("token");
        user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusMinutes(5));

        when(userRepository.findByEmailVerificationToken("token")).thenReturn(Optional.of(user));
        when(tokenService.isEmailVerificationTokenValid(user)).thenReturn(true);

        emailVerificationService.verifyEmail("token");

        ArgumentCaptor<User> savedUser = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(savedUser.capture());
        assertEquals(AccountStatus.ACTIVE, savedUser.getValue().getStatus());
        verify(tokenService).clearEmailVerificationToken(user);
        verify(validationUtil).validateUserNotVerified(user);
    }
}
