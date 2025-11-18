package com.musicapp.auth_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ServiceResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private String errorCode;

    public static <T> ServiceResponse<T> success(T data) {
        return new ServiceResponse<>(true, data, null, null);
    }

    public static <T> ServiceResponse<T> success(T data, String message) {
        return new ServiceResponse<>(true, data, message, null);
    }

    public static <T> ServiceResponse<T> error(String message, String errorCode) {
        return new ServiceResponse<>(false, null, message, errorCode);
    }
}