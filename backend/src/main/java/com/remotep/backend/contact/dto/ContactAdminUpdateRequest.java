package com.remotep.backend.contact.dto;

public record ContactAdminUpdateRequest(
        String status,
        String priority,
        String comment
) {
}
