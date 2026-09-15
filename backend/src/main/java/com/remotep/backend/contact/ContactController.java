package com.remotep.backend.contact;

import com.remotep.backend.auth.UserPrincipal;
import com.remotep.backend.contact.dto.ContactAdminUpdateRequest;
import com.remotep.backend.contact.dto.ContactCreateRequest;
import com.remotep.backend.contact.dto.ContactResponse;
import com.remotep.backend.contact.dto.ContactStatusUpdateRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse create(
            @RequestBody ContactCreateRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return contactService.create(request, principal == null ? null : principal.getUser());
    }

    @GetMapping("/my")
    public List<ContactResponse> findMine(@AuthenticationPrincipal UserPrincipal principal) {
        return contactService.findMine(principal.getUser());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ContactResponse> findAll() {
        return contactService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ContactResponse findById(@PathVariable Long id) {
        return contactService.findById(id);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ContactResponse updateStatus(
            @PathVariable Long id,
            @RequestBody ContactStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return contactService.updateStatus(id, request, principal.getUser());
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ContactResponse updateByAdmin(
            @PathVariable Long id,
            @RequestBody ContactAdminUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return contactService.updateByAdmin(id, request, principal.getUser());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> delete(@PathVariable Long id) {
        contactService.delete(id);
        return Map.of("message", "Contact request deleted");
    }
}
