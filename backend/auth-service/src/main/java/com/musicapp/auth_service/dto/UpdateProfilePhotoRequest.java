package com.musicapp.auth_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfilePhotoRequest {

    @NotBlank(message = "Profile photo URL is required")
    private String profilePhotoUrl;
}