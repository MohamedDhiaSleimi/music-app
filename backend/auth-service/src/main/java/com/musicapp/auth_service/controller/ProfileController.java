package com.musicapp.auth_service.controller;

import com.musicapp.auth_service.dto.request.UpdateProfilePhotoRequest;
import com.musicapp.auth_service.dto.request.UpdateUsernameRequest;
import com.musicapp.auth_service.dto.response.MessageResponse;
import com.musicapp.auth_service.dto.response.UserProfileResponse;
import com.musicapp.auth_service.security.JwtUtil;
import com.musicapp.auth_service.service.EmailVerificationService;
import com.musicapp.auth_service.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final EmailVerificationService emailVerificationService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            UserProfileResponse profile = profileService.getUserProfile(userId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/username")
    public ResponseEntity<?> updateUsername(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody UpdateUsernameRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            UserProfileResponse profile = profileService.updateUsername(userId, request.getUsername());
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/photo")
    public ResponseEntity<?> updateProfilePhoto(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody UpdateProfilePhotoRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            UserProfileResponse profile = profileService.updateProfilePhoto(userId, request.getProfilePhotoUrl());
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/photo")
    public ResponseEntity<?> removeProfilePhoto(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            UserProfileResponse profile = profileService.removeProfilePhoto(userId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/request-verification")
    public ResponseEntity<?> requestVerification(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            emailVerificationService.requestVerificationForExistingUser(userId);
            return ResponseEntity.ok(new MessageResponse("Verification email sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}