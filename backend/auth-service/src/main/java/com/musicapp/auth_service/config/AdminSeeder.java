package com.musicapp.auth_service.config;

import com.musicapp.auth_service.constants.AppConstants;
import com.musicapp.auth_service.model.AccountStatus;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@admin.com";
        String adminUsername = "admin";
        if (userRepository.existsByEmail(adminEmail) || userRepository.existsByUsername(adminUsername)) {
            return;
        }

        User admin = new User();
        admin.setEmail(adminEmail);
        admin.setUsername(adminUsername);
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setStatus(AccountStatus.ACTIVE);
        admin.setProvider(AppConstants.PROVIDER_LOCAL);
        admin.setCreatedAt(LocalDateTime.now());

        userRepository.save(admin);
        log.info("Seeded default admin user with email {}", adminEmail);
    }
}
