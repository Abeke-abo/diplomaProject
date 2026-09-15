package com.remotep.backend.content.dto;

import java.math.BigDecimal;

public record ServiceOfferingResponse(
        Long id,
        String title,
        String description,
        BigDecimal priceFrom,
        String duration,
        String iconKey,
        Integer sortOrder
) {
}
