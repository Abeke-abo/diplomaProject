package com.remotep.backend.auth.dto;

public record RegisterRequest(String name, String email, String password) {
}
