package com.musicapp.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuth2UserInfo {
    private String id;
    private String email;
    private String name;
    private String picture;
}