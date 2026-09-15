package com.remotep.backend.auth.dto;

public record AuthResponse(String token, String refreshToken, UserResponse user) {
}
