package com.remotep.backend.contact;

import com.remotep.backend.auth.AppUser;
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
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "contact_request_status_history")
public class ContactRequestStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "contact_request_id", nullable = false)
    private ContactRequest contactRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_user_id")
    private AppUser changedByUser;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private ContactStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ContactStatus newStatus;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public ContactRequest getContactRequest() {
        return contactRequest;
    }

    public void setContactRequest(ContactRequest contactRequest) {
        this.contactRequest = contactRequest;
    }

    public AppUser getChangedByUser() {
        return changedByUser;
    }

    public void setChangedByUser(AppUser changedByUser) {
        this.changedByUser = changedByUser;
    }

    public ContactStatus getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(ContactStatus oldStatus) {
        this.oldStatus = oldStatus;
    }

    public ContactStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(ContactStatus newStatus) {
        this.newStatus = newStatus;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
