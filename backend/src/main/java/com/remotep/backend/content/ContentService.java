package com.remotep.backend.content;

import com.remotep.backend.content.dto.PortfolioProjectResponse;
import com.remotep.backend.content.dto.ServiceOfferingResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContentService {
    private final ServiceOfferingRepository serviceOfferingRepository;
    private final PortfolioProjectRepository portfolioProjectRepository;

    public ContentService(
            ServiceOfferingRepository serviceOfferingRepository,
            PortfolioProjectRepository portfolioProjectRepository
    ) {
        this.serviceOfferingRepository = serviceOfferingRepository;
        this.portfolioProjectRepository = portfolioProjectRepository;
    }

    @Transactional(readOnly = true)
    public List<ServiceOfferingResponse> findServices(String language) {
        boolean kz = isKazakh(language);
        return serviceOfferingRepository.findAllByActiveTrueOrderBySortOrderAsc()
                .stream()
                .map(service -> new ServiceOfferingResponse(
                        service.getId(),
                        kz ? service.getTitleKz() : service.getTitleRu(),
                        kz ? service.getDescriptionKz() : service.getDescriptionRu(),
                        service.getPriceFrom(),
                        kz ? service.getDurationKz() : service.getDurationRu(),
                        service.getIconKey(),
                        service.getSortOrder()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PortfolioProjectResponse> findPortfolio(String language) {
        boolean kz = isKazakh(language);
        return portfolioProjectRepository.findAllByActiveTrueOrderBySortOrderAsc()
                .stream()
                .map(project -> new PortfolioProjectResponse(
                        project.getId(),
                        project.getTitle(),
                        kz ? project.getCategoryKz() : project.getCategoryRu(),
                        kz ? project.getDescriptionKz() : project.getDescriptionRu(),
                        project.getImageUrl(),
                        project.getTechnologies(),
                        project.getProjectUrl(),
                        project.getSortOrder()
                ))
                .toList();
    }

    private boolean isKazakh(String language) {
        return language != null && language.toLowerCase().startsWith("kz");
    }
}
