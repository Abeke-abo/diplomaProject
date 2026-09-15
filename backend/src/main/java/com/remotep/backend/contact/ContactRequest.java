package com.remotep.backend.contact;

import com.remotep.backend.auth.AppUser;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contact_requests")
public class ContactRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 160)
    private String email;

    @Column(nullable = false, length = 3000)
    private String message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ContactStatus status = ContactStatus.NEW;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ContactPriority priority = ContactPriority.MEDIUM;

    @OneToMany(mappedBy = "contactRequest", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ContactRequestComment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "contactRequest", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ContactRequestStatusHistory> statusHistory = new ArrayList<>();

    @OneToMany(mappedBy = "contactRequest", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<TelegramNotification> telegramNotifications = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
        email = email.toLowerCase();
        if (priority == null) {
            priority = ContactPriority.MEDIUM;
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
        email = email.toLowerCase();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser user) {
        this.user = user;
    }

    public ContactStatus getStatus() {
        return status;
    }

    public void setStatus(ContactStatus status) {
        this.status = status;
    }

    public ContactPriority getPriority() {
        return priority == null ? ContactPriority.MEDIUM : priority;
    }

    public void setPriority(ContactPriority priority) {
        this.priority = priority;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
