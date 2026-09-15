package com.remotep.backend.contact.dto;

import java.time.Instant;
import java.util.List;

public record ContactResponse(
        Long id,
        String name,
        String email,
        String message,
        Long userId,
        String userName,
        String userEmail,
        String status,
        String priority,
        List<ContactCommentResponse> comments,
        List<ContactStatusHistoryResponse> statusHistory,
        List<TelegramNotificationResponse> telegramNotifications,
        Instant createdAt,
        Instant updatedAt
) {
}
