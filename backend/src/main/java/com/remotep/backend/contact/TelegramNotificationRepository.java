package com.remotep.backend.contact;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TelegramNotificationRepository extends JpaRepository<TelegramNotification, Long> {
    List<TelegramNotification> findAllByContactRequestOrderByCreatedAtDesc(ContactRequest contactRequest);
}
