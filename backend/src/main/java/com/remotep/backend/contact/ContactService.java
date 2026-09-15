package com.remotep.backend.contact;

import com.remotep.backend.auth.AppUser;
import com.remotep.backend.common.ApiException;
import com.remotep.backend.contact.dto.ContactAdminUpdateRequest;
import com.remotep.backend.contact.dto.ContactCommentResponse;
import com.remotep.backend.contact.dto.ContactCreateRequest;
import com.remotep.backend.contact.dto.ContactResponse;
import com.remotep.backend.contact.dto.ContactStatusHistoryResponse;
import com.remotep.backend.contact.dto.ContactStatusUpdateRequest;
import com.remotep.backend.contact.dto.TelegramNotificationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class ContactService {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    private final ContactRepository contactRepository;
    private final ContactRequestCommentRepository commentRepository;
    private final ContactRequestStatusHistoryRepository statusHistoryRepository;
    private final TelegramNotificationRepository telegramNotificationRepository;
    private final TelegramNotifier telegramNotifier;

    public ContactService(
            ContactRepository contactRepository,
            ContactRequestCommentRepository commentRepository,
            ContactRequestStatusHistoryRepository statusHistoryRepository,
            TelegramNotificationRepository telegramNotificationRepository,
            TelegramNotifier telegramNotifier
    ) {
        this.contactRepository = contactRepository;
        this.commentRepository = commentRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.telegramNotificationRepository = telegramNotificationRepository;
        this.telegramNotifier = telegramNotifier;
    }

    @Transactional
    public ContactResponse create(ContactCreateRequest request, AppUser user) {
        ContactRequest contact = new ContactRequest();
        contact.setName(requireLength(request.name(), "Name is required", 120));
        contact.setEmail(normalizeEmail(request.email()));
        contact.setMessage(requireLength(request.message(), "Message is required", 3000));
        contact.setUser(user);
        ContactRequest savedContact = contactRepository.save(contact);
        addStatusHistory(savedContact, null, ContactStatus.NEW, user);
        telegramNotifier.notifyNewContact(savedContact);
        return toResponse(savedContact);
    }

    @Transactional(readOnly = true)
    public List<ContactResponse> findAll() {
        return contactRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ContactResponse> findMine(AppUser user) {
        return contactRepository.findAllByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ContactResponse findById(Long id) {
        return toResponse(findEntity(id));
    }

    @Transactional
    public ContactResponse updateStatus(Long id, ContactStatusUpdateRequest request, AppUser admin) {
        ContactRequest contact = findEntity(id);
        ContactStatus nextStatus = parseStatus(request.status());
        updateStatusIfChanged(contact, nextStatus, admin);
        return toResponse(contact);
    }

    @Transactional
    public ContactResponse updateByAdmin(Long id, ContactAdminUpdateRequest request, AppUser admin) {
        ContactRequest contact = findEntity(id);

        if (request.status() != null && !request.status().isBlank()) {
            updateStatusIfChanged(contact, parseStatus(request.status()), admin);
        }

        if (request.priority() != null && !request.priority().isBlank()) {
            contact.setPriority(parsePriority(request.priority()));
        }

        if (request.comment() != null && !request.comment().isBlank()) {
            ContactRequestComment comment = new ContactRequestComment();
            comment.setContactRequest(contact);
            comment.setAdmin(admin);
            comment.setComment(requireLength(request.comment(), "Comment is required", 2000));
            commentRepository.save(comment);
        }

        return toResponse(contact);
    }

    @Transactional
    public void delete(Long id) {
        ContactRequest contact = findEntity(id);
        contactRepository.delete(contact);
    }

    private ContactRequest findEntity(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Contact request not found"));
    }

    private ContactResponse toResponse(ContactRequest contact) {
        AppUser user = contact.getUser();

        return new ContactResponse(
                contact.getId(),
                contact.getName(),
                contact.getEmail(),
                contact.getMessage(),
                user == null ? null : user.getId(),
                user == null ? null : user.getName(),
                user == null ? null : user.getEmail(),
                contact.getStatus().name(),
                contact.getPriority().name(),
                commentRepository.findAllByContactRequestOrderByCreatedAtAsc(contact)
                        .stream()
                        .map(this::toCommentResponse)
                        .toList(),
                statusHistoryRepository.findAllByContactRequestOrderByCreatedAtAsc(contact)
                        .stream()
                        .map(this::toStatusHistoryResponse)
                        .toList(),
                telegramNotificationRepository.findAllByContactRequestOrderByCreatedAtDesc(contact)
                        .stream()
                        .map(this::toTelegramNotificationResponse)
                        .toList(),
                contact.getCreatedAt(),
                contact.getUpdatedAt()
        );
    }

    private ContactCommentResponse toCommentResponse(ContactRequestComment comment) {
        AppUser admin = comment.getAdmin();
        return new ContactCommentResponse(
                comment.getId(),
                admin.getId(),
                admin.getName(),
                comment.getComment(),
                comment.getCreatedAt()
        );
    }

    private ContactStatusHistoryResponse toStatusHistoryResponse(ContactRequestStatusHistory history) {
        AppUser changedByUser = history.getChangedByUser();
        ContactStatus oldStatus = history.getOldStatus();
        return new ContactStatusHistoryResponse(
                history.getId(),
                changedByUser == null ? null : changedByUser.getId(),
                changedByUser == null ? null : changedByUser.getName(),
                oldStatus == null ? null : oldStatus.name(),
                history.getNewStatus().name(),
                history.getCreatedAt()
        );
    }

    private TelegramNotificationResponse toTelegramNotificationResponse(TelegramNotification notification) {
        return new TelegramNotificationResponse(
                notification.getId(),
                notification.getChatId(),
                notification.getStatus().name(),
                notification.getErrorMessage(),
                notification.getSentAt(),
                notification.getCreatedAt()
        );
    }

    private void updateStatusIfChanged(ContactRequest contact, ContactStatus nextStatus, AppUser changedByUser) {
        ContactStatus oldStatus = contact.getStatus();
        if (oldStatus == nextStatus) {
            return;
        }

        contact.setStatus(nextStatus);
        addStatusHistory(contact, oldStatus, nextStatus, changedByUser);
    }

    private void addStatusHistory(
            ContactRequest contact,
            ContactStatus oldStatus,
            ContactStatus newStatus,
            AppUser changedByUser
    ) {
        ContactRequestStatusHistory history = new ContactRequestStatusHistory();
        history.setContactRequest(contact);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setChangedByUser(changedByUser);
        statusHistoryRepository.save(history);
    }

    private ContactStatus parseStatus(String status) {
        try {
            return ContactStatus.valueOf(status.trim().toUpperCase());
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Unknown contact status");
        }
    }

    private ContactPriority parsePriority(String priority) {
        try {
            return ContactPriority.valueOf(priority.trim().toUpperCase());
        } catch (Exception ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Unknown contact priority");
        }
    }

    private String normalizeEmail(String email) {
        String normalized = requireLength(email, "Email is required", 160).toLowerCase();
        if (!EMAIL_PATTERN.matcher(normalized).matches()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email format is invalid");
        }
        return normalized;
    }

    private String requireLength(String value, String message, int maxLength) {
        if (value == null || value.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, message);
        }
        String trimmed = value.trim();
        if (trimmed.length() > maxLength) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Field is too long");
        }
        return trimmed;
    }
}
