package com.remotep.backend.content.dto;

public record PortfolioProjectResponse(
        Long id,
        String title,
        String category,
        String description,
        String imageUrl,
        String technologies,
        String projectUrl,
        Integer sortOrder
) {
}
