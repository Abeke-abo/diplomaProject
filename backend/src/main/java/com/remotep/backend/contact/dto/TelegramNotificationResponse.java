package com.remotep.backend.contact.dto;

import java.time.Instant;

public record TelegramNotificationResponse(
        Long id,
        String chatId,
        String status,
        String errorMessage,
        Instant sentAt,
        Instant createdAt
) {
}
