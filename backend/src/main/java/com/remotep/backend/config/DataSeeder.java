package com.remotep.backend.config;

import com.remotep.backend.auth.AppUser;
import com.remotep.backend.auth.AppUserRepository;
import com.remotep.backend.auth.Role;
import com.remotep.backend.content.PortfolioProject;
import com.remotep.backend.content.PortfolioProjectRepository;
import com.remotep.backend.content.ServiceOffering;
import com.remotep.backend.content.ServiceOfferingRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Component
public class DataSeeder implements CommandLineRunner {
    private final AppUserRepository userRepository;
    private final ServiceOfferingRepository serviceOfferingRepository;
    private final PortfolioProjectRepository portfolioProjectRepository;
    private final PasswordEncoder passwordEncoder;
    private final boolean enabled;
    private final String adminEmail;
    private final String adminPassword;
    private final String adminName;

    public DataSeeder(
            AppUserRepository userRepository,
            ServiceOfferingRepository serviceOfferingRepository,
            PortfolioProjectRepository portfolioProjectRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.seed-admin.enabled}") boolean enabled,
            @Value("${app.seed-admin.email}") String adminEmail,
            @Value("${app.seed-admin.password}") String adminPassword,
            @Value("${app.seed-admin.name}") String adminName
    ) {
        this.userRepository = userRepository;
        this.serviceOfferingRepository = serviceOfferingRepository;
        this.portfolioProjectRepository = portfolioProjectRepository;
        this.passwordEncoder = passwordEncoder;
        this.enabled = enabled;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.adminName = adminName;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedServices();
        seedPortfolio();
    }

    private void seedAdmin() {
        if (!enabled || userRepository.existsByEmail(adminEmail.toLowerCase())) {
            return;
        }

        AppUser admin = new AppUser();
        admin.setName(adminName);
        admin.setEmail(adminEmail.toLowerCase());
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
    }

    private void seedServices() {
        List<ServiceOffering> existingServices = serviceOfferingRepository.findAllByOrderBySortOrderAscIdAsc();

        upsertService(
                existingServices,
                1,
                "Веб-разработка",
                "Веб-әзірлеу",
                "Создание корпоративных сайтов, лендингов и веб-приложений на React с адаптивным интерфейсом.",
                "React негізіндегі корпоративтік сайттар, лендингтер және бейімделгіш веб-қосымшалар жасау.",
                "globe",
                "2-6 недель",
                "2-6 апта",
                "350000"
        );
        upsertService(
                existingServices,
                2,
                "Backend и API",
                "Backend және API",
                "Разработка серверной части, REST API, авторизации, баз данных и интеграций с внешними сервисами.",
                "Серверлік бөлік, REST API, авторизация, дерекқор және сыртқы сервистермен интеграция әзірлеу.",
                "code",
                "3-8 недель",
                "3-8 апта",
                "450000"
        );
        upsertService(
                existingServices,
                3,
                "UI/UX дизайн",
                "UI/UX дизайн",
                "Проектирование структуры экранов, пользовательских сценариев и визуального стиля продукта.",
                "Экран құрылымын, пайдаланушы сценарийлерін және өнімнің визуалды стилін жобалау.",
                "layout",
                "1-3 недели",
                "1-3 апта",
                "200000"
        );
        upsertService(
                existingServices,
                4,
                "Мобильные приложения",
                "Мобильді қосымшалар",
                "Проектирование и разработка мобильных решений для iOS и Android под задачи бизнеса.",
                "iOS және Android үшін бизнес міндеттеріне сай мобильді шешімдерді жобалау және әзірлеу.",
                "smartphone",
                "6-12 недель",
                "6-12 апта",
                "700000"
        );
        upsertService(
                existingServices,
                5,
                "AI-интеграции",
                "AI интеграциялары",
                "Встраивание AI-инструментов в рабочие процессы и автоматизация повторяющихся задач.",
                "AI құралдарын жұмыс процестеріне енгізу және қайталанатын тапсырмаларды автоматтандыру.",
                "cpu",
                "3-7 недель",
                "3-7 апта",
                "500000"
        );
        upsertService(
                existingServices,
                6,
                "Запуск MVP",
                "MVP іске қосу",
                "Быстрая сборка минимальной рабочей версии продукта для демонстрации и проверки идеи.",
                "Идеяны тексеру және көрсету үшін өнімнің алғашқы жұмыс нұсқасын жылдам дайындау.",
                "rocket",
                "4-8 недель",
                "4-8 апта",
                "600000"
        );
    }

    private void seedPortfolio() {
        List<PortfolioProject> existingProjects = portfolioProjectRepository.findAllByOrderBySortOrderAscIdAsc();

        upsertProject(
                existingProjects,
                1,
                "FinTech Platform",
                "Веб-разработка",
                "Веб-әзірлеу",
                "Аналитическая система для финансовой компании с личным кабинетом и интеграцией платежных сервисов.",
                "Жеке кабинеті және төлем сервистерімен интеграциясы бар қаржы компаниясына арналған аналитикалық жүйе.",
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
                "React, Spring Boot, PostgreSQL",
                "https://example.com/fintech"
        );
        upsertProject(
                existingProjects,
                2,
                "E-commerce App",
                "Мобильные приложения",
                "Мобильді қосымшалар",
                "Интернет-магазин с каталогом, корзиной, оплатой и удобным оформлением заказа.",
                "Каталогы, себеті, төлемі және тапсырысты ыңғайлы рәсімдеуі бар интернет-дүкен.",
                "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800",
                "Flutter, REST API, PostgreSQL",
                "https://example.com/ecommerce"
        );
        upsertProject(
                existingProjects,
                3,
                "AI Healthcare",
                "Machine Learning",
                "Machine Learning",
                "Сервис для анализа медицинских данных и поддержки принятия решений специалистами.",
                "Медициналық деректерді талдауға және мамандардың шешім қабылдауына көмектесетін сервис.",
                "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
                "Python, AI API, Spring Boot",
                "https://example.com/healthcare"
        );
    }

    private void upsertService(
            List<ServiceOffering> existingServices,
            int sortOrder,
            String titleRu,
            String titleKz,
            String descriptionRu,
            String descriptionKz,
            String iconKey,
            String durationRu,
            String durationKz,
            String priceFrom
    ) {
        ServiceOffering service = existingServices.stream()
                .filter(item -> Integer.valueOf(sortOrder).equals(item.getSortOrder()))
                .findFirst()
                .orElseGet(ServiceOffering::new);
        service.setSortOrder(sortOrder);
        service.setTitleRu(titleRu);
        service.setTitleKz(titleKz);
        service.setDescriptionRu(descriptionRu);
        service.setDescriptionKz(descriptionKz);
        service.setIconKey(iconKey);
        service.setDurationRu(durationRu);
        service.setDurationKz(durationKz);
        service.setPriceFrom(new BigDecimal(priceFrom));
        service.setActive(true);
        ServiceOffering savedService = serviceOfferingRepository.save(service);
        existingServices.stream()
                .filter(item -> Integer.valueOf(sortOrder).equals(item.getSortOrder()))
                .filter(item -> !Objects.equals(item.getId(), savedService.getId()))
                .forEach(item -> {
                    item.setActive(false);
                    serviceOfferingRepository.save(item);
                });
    }

    private void upsertProject(
            List<PortfolioProject> existingProjects,
            int sortOrder,
            String title,
            String categoryRu,
            String categoryKz,
            String descriptionRu,
            String descriptionKz,
            String imageUrl,
            String technologies,
            String projectUrl
    ) {
        PortfolioProject project = existingProjects.stream()
                .filter(item -> Integer.valueOf(sortOrder).equals(item.getSortOrder()))
                .findFirst()
                .orElseGet(PortfolioProject::new);
        project.setSortOrder(sortOrder);
        project.setTitle(title);
        project.setCategoryRu(categoryRu);
        project.setCategoryKz(categoryKz);
        project.setDescriptionRu(descriptionRu);
        project.setDescriptionKz(descriptionKz);
        project.setImageUrl(imageUrl);
        project.setTechnologies(technologies);
        project.setProjectUrl(projectUrl);
        project.setActive(true);
        PortfolioProject savedProject = portfolioProjectRepository.save(project);
        existingProjects.stream()
                .filter(item -> Integer.valueOf(sortOrder).equals(item.getSortOrder()))
                .filter(item -> !Objects.equals(item.getId(), savedProject.getId()))
                .forEach(item -> {
                    item.setActive(false);
                    portfolioProjectRepository.save(item);
                });
    }
}
