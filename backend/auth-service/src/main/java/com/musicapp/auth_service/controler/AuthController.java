package com.musicapp.auth_service.controler;

import com.musicapp.auth_service.dto.AuthResponse;
import com.musicapp.auth_service.dto.LoginRequest;
import com.musicapp.auth_service.dto.RegisterRequest;
import com.musicapp.auth_service.model.User;
import com.musicapp.auth_service.service.AuthService;
import com.musicapp.auth_service.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

	@PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String userId = jwtUtil.getUserIdFromToken(token);
            User user = authService.getUserById(userId);
            
            return ResponseEntity.ok(new AuthResponse(
                    token,
                    user.getId(),
                    user.getEmail(),
                    user.getUsername(),
                    user.getProfileImageUrl()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}