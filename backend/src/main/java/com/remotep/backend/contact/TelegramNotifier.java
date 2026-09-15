package com.remotep.backend.contact;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class TelegramNotifier {
    private static final Logger log = LoggerFactory.getLogger(TelegramNotifier.class);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter
            .ofPattern("dd.MM.yyyy HH:mm")
            .withZone(ZoneId.systemDefault());

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final boolean enabled;
    private final String botToken;
    private final String chatId;
    private final String apiUrl;
    private final TelegramNotificationRepository notificationRepository;

    public TelegramNotifier(
            @Value("${app.telegram.enabled}") boolean enabled,
            @Value("${app.telegram.bot-token}") String botToken,
            @Value("${app.telegram.chat-id}") String chatId,
            @Value("${app.telegram.api-url}") String apiUrl,
            TelegramNotificationRepository notificationRepository
    ) {
        this.enabled = enabled;
        this.botToken = botToken;
        this.chatId = chatId;
        this.apiUrl = apiUrl;
        this.notificationRepository = notificationRepository;
    }

    public void notifyNewContact(ContactRequest contact) {
        if (!enabled || isBlank(botToken) || isBlank(chatId)) {
            saveNotification(contact, TelegramNotificationStatus.SKIPPED, "Telegram is disabled or not configured", null);
            return;
        }

        String message = """
                New RemoteP request

                Name: %s
                Email: %s
                Status: %s
                Created: %s

                Message:
                %s
                """.formatted(
                contact.getName(),
                contact.getEmail(),
                contact.getStatus().name(),
                FORMATTER.format(contact.getCreatedAt()),
                contact.getMessage()
        );

        String formBody = "chat_id=" + encode(chatId)
                + "&text=" + encode(message)
                + "&disable_web_page_preview=true";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl + "/bot" + botToken + "/sendMessage"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(formBody))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                saveNotification(contact, TelegramNotificationStatus.SENT, null, Instant.now());
            } else {
                saveNotification(contact, TelegramNotificationStatus.FAILED, "Telegram API status " + response.statusCode(), null);
            }
        } catch (Exception ex) {
            log.warn("Could not send Telegram notification", ex);
            saveNotification(contact, TelegramNotificationStatus.FAILED, ex.getMessage(), null);
        }
    }

    private void saveNotification(
            ContactRequest contact,
            TelegramNotificationStatus status,
            String errorMessage,
            Instant sentAt
    ) {
        TelegramNotification notification = new TelegramNotification();
        notification.setContactRequest(contact);
        notification.setChatId(isBlank(chatId) ? null : chatId);
        notification.setStatus(status);
        notification.setErrorMessage(limit(errorMessage, 1000));
        notification.setSentAt(sentAt);
        notificationRepository.save(notification);
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String limit(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength);
    }
}
