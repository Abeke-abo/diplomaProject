package com.remotep.backend.contact;

import com.remotep.backend.auth.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRepository extends JpaRepository<ContactRequest, Long> {
    List<ContactRequest> findAllByOrderByCreatedAtDesc();

    List<ContactRequest> findAllByUserOrderByCreatedAtDesc(AppUser user);
}
