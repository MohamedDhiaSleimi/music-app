package com.musicapp.auth_service.controller;

import com.musicapp.auth_service.dto.response.AdminUserResponse;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.repository.UserRepository;
import com.musicapp.auth_service.util.UserIdExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final UserIdExtractor userIdExtractor;

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> listUsers(
            @RequestHeader("Authorization") String authHeader
    ) {
        String userId = userIdExtractor.extractUserId(authHeader);
        User admin = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (admin.getUsername() == null || !"admin".equalsIgnoreCase(admin.getUsername())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }

        List<AdminUserResponse> users = userRepository.findAll().stream()
                .map(user -> new AdminUserResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getUsername(),
                        user.getProfileImageUrl(),
                        user.getStatus(),
                        user.getProvider(),
                        user.getCreatedAt(),
                        user.getLastLogin()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }
}
