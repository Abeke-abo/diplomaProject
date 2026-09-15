package com.remotep.backend.content;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "services")
public class ServiceOffering {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title_ru", nullable = false, length = 160)
    private String titleRu;

    @Column(name = "title_kz", nullable = false, length = 160)
    private String titleKz;

    @Column(name = "description_ru", nullable = false, length = 1500)
    private String descriptionRu;

    @Column(name = "description_kz", nullable = false, length = 1500)
    private String descriptionKz;

    @Column(name = "price_from", precision = 12, scale = 2)
    private BigDecimal priceFrom;

    @Column(name = "duration_ru", length = 80)
    private String durationRu;

    @Column(name = "duration_kz", length = 80)
    private String durationKz;

    @Column(name = "icon_key", nullable = false, length = 60)
    private String iconKey;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getTitleRu() {
        return titleRu;
    }

    public void setTitleRu(String titleRu) {
        this.titleRu = titleRu;
    }

    public String getTitleKz() {
        return titleKz;
    }

    public void setTitleKz(String titleKz) {
        this.titleKz = titleKz;
    }

    public String getDescriptionRu() {
        return descriptionRu;
    }

    public void setDescriptionRu(String descriptionRu) {
        this.descriptionRu = descriptionRu;
    }

    public String getDescriptionKz() {
        return descriptionKz;
    }

    public void setDescriptionKz(String descriptionKz) {
        this.descriptionKz = descriptionKz;
    }

    public BigDecimal getPriceFrom() {
        return priceFrom;
    }

    public void setPriceFrom(BigDecimal priceFrom) {
        this.priceFrom = priceFrom;
    }

    public String getDurationRu() {
        return durationRu;
    }

    public void setDurationRu(String durationRu) {
        this.durationRu = durationRu;
    }

    public String getDurationKz() {
        return durationKz;
    }

    public void setDurationKz(String durationKz) {
        this.durationKz = durationKz;
    }

    public String getIconKey() {
        return iconKey;
    }

    public void setIconKey(String iconKey) {
        this.iconKey = iconKey;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
