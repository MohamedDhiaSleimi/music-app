package com.musicapp.auth_service.controller;

import com.musicapp.auth_service.constants.AppConstants;
import com.musicapp.auth_service.dto.request.UpdateProfilePhotoRequest;
import com.musicapp.auth_service.dto.request.UpdateUsernameRequest;
import com.musicapp.auth_service.dto.response.MessageResponse;
import com.musicapp.auth_service.dto.response.UserProfileResponse;
import com.musicapp.auth_service.service.EmailVerificationService;
import com.musicapp.auth_service.service.ProfileService;
import com.musicapp.auth_service.util.UserIdExtractor;
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
    private final UserIdExtractor userIdExtractor;

    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile(@RequestHeader("Authorization") String authHeader) {
        String userId = userIdExtractor.extractUserId(authHeader);
        UserProfileResponse profile = profileService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/username")
    public ResponseEntity<UserProfileResponse> updateUsername(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody UpdateUsernameRequest request) {
        String userId = userIdExtractor.extractUserId(authHeader);
        UserProfileResponse profile = profileService.updateUsername(userId, request.getUsername());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/photo")
    public ResponseEntity<UserProfileResponse> updateProfilePhoto(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody UpdateProfilePhotoRequest request) {
        String userId = userIdExtractor.extractUserId(authHeader);
        UserProfileResponse profile = profileService.updateProfilePhoto(userId, request.getProfilePhotoUrl());
        return ResponseEntity.ok(profile);
    }

    @DeleteMapping("/photo")
    public ResponseEntity<UserProfileResponse> removeProfilePhoto(@RequestHeader("Authorization") String authHeader) {
        String userId = userIdExtractor.extractUserId(authHeader);
        UserProfileResponse profile = profileService.removeProfilePhoto(userId);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/request-verification")
    public ResponseEntity<MessageResponse> requestVerification(@RequestHeader("Authorization") String authHeader) {
        String userId = userIdExtractor.extractUserId(authHeader);
        emailVerificationService.requestVerificationForExistingUser(userId);
        return ResponseEntity.ok(new MessageResponse(AppConstants.SUCCESS_VERIFICATION_SENT));
    }
}