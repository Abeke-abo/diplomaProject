package com.remotep.backend.content;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PortfolioProjectRepository extends JpaRepository<PortfolioProject, Long> {
    List<PortfolioProject> findAllByActiveTrueOrderBySortOrderAsc();

    List<PortfolioProject> findAllByOrderBySortOrderAscIdAsc();

    Optional<PortfolioProject> findFirstBySortOrder(Integer sortOrder);
}
