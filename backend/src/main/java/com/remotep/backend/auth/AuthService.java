package com.remotep.backend.auth;

import com.remotep.backend.auth.dto.AuthResponse;
import com.remotep.backend.auth.dto.LoginRequest;
import com.remotep.backend.auth.dto.RefreshRequest;
import com.remotep.backend.auth.dto.RegisterRequest;
import com.remotep.backend.auth.dto.UserResponse;
import com.remotep.backend.common.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.regex.Pattern;

@Service
public class AuthService {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private final AppUserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SecureRandom secureRandom = new SecureRandom();
    private final long refreshTokenDays;

    public AuthService(
            AppUserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            @Value("${app.refresh-token-days}") long refreshTokenDays
    ) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenDays = refreshTokenDays;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        String password = requirePassword(request.password());
        String name = normalizeName(request.name(), email);

        if (userRepository.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email is already registered");
        }

        AppUser user = new AppUser();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(Role.USER);
        userRepository.save(user);

        return issueTokens(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());
        String password = requireNotBlank(request.password(), "Password is required");

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return issueTokens(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        String rawToken = requireNotBlank(request.refreshToken(), "Refresh token is required");
        RefreshToken token = refreshTokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Refresh token is invalid"));

        if (!token.isActive()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Refresh token is expired or revoked");
        }

        token.revoke();
        return issueTokens(token.getUser());
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }
        refreshTokenRepository.findByTokenHash(hash(refreshToken))
                .filter(RefreshToken::isActive)
                .ifPresent(token -> {
                    token.revoke();
                    refreshTokenRepository.save(token);
                });
    }

    public UserResponse toUserResponse(AppUser user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    private AuthResponse issueTokens(AppUser user) {
        String accessToken = jwtService.generate(user);
        String refreshToken = generateRefreshToken();

        RefreshToken entity = new RefreshToken();
        entity.setUser(user);
        entity.setTokenHash(hash(refreshToken));
        entity.setExpiresAt(Instant.now().plus(refreshTokenDays, ChronoUnit.DAYS));
        refreshTokenRepository.save(entity);

        return new AuthResponse(accessToken, refreshToken, toUserResponse(user));
    }

    private String normalizeEmail(String email) {
        String normalized = requireNotBlank(email, "Email is required").toLowerCase();
        if (!EMAIL_PATTERN.matcher(normalized).matches()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email format is invalid");
        }
        return normalized;
    }

    private String normalizeName(String name, String email) {
        if (name == null || name.isBlank()) {
            return email.substring(0, email.indexOf('@'));
        }
        String normalized = name.trim();
        if (normalized.length() > 100) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Name is too long");
        }
        return normalized;
    }

    private String requirePassword(String password) {
        String value = requireNotBlank(password, "Password is required");
        if (value.length() < 8) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Password must contain at least 8 characters");
        }
        return value;
    }

    private String requireNotBlank(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }

    private String generateRefreshToken() {
        byte[] bytes = new byte[48];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception ex) {
            throw new IllegalStateException("Could not hash token", ex);
        }
    }
}
