package com.remotep.backend.content;

import com.remotep.backend.content.dto.PortfolioProjectResponse;
import com.remotep.backend.content.dto.ServiceOfferingResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/content")
public class ContentController {
    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/services")
    public List<ServiceOfferingResponse> findServices(@RequestParam(defaultValue = "ru") String lang) {
        return contentService.findServices(lang);
    }

    @GetMapping("/portfolio")
    public List<PortfolioProjectResponse> findPortfolio(@RequestParam(defaultValue = "ru") String lang) {
        return contentService.findPortfolio(lang);
    }
}
