package com.remotep.backend.contact;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRequestStatusHistoryRepository extends JpaRepository<ContactRequestStatusHistory, Long> {
    List<ContactRequestStatusHistory> findAllByContactRequestOrderByCreatedAtAsc(ContactRequest contactRequest);
}
