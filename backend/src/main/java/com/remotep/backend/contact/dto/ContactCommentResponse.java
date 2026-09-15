package com.remotep.backend.contact.dto;

import java.time.Instant;

public record ContactCommentResponse(
        Long id,
        Long adminId,
        String adminName,
        String comment,
        Instant createdAt
) {
}
