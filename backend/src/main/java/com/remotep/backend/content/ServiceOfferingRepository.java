package com.remotep.backend.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {
    List<ServiceOffering> findAllByActiveTrueOrderBySortOrderAsc();

    List<ServiceOffering> findAllByOrderBySortOrderAscIdAsc();

    Optional<ServiceOffering> findFirstBySortOrder(Integer sortOrder);
}
