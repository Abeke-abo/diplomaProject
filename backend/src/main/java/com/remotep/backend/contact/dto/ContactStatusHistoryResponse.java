package com.remotep.backend.contact.dto;

import java.time.Instant;

public record ContactStatusHistoryResponse(
        Long id,
        Long changedByUserId,
        String changedByUserName,
        String oldStatus,
        String newStatus,
        Instant createdAt
) {
}
