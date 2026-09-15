package com.remotep.backend.contact;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRequestCommentRepository extends JpaRepository<ContactRequestComment, Long> {
    List<ContactRequestComment> findAllByContactRequestOrderByCreatedAtAsc(ContactRequest contactRequest);
}
