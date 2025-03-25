package com.renting.RentingApplicaton.entity.property;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

import com.renting.RentingApplicaton.entity.auth.User;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer property_id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String status; // AVAILABLE, RENTED, UNAVAILABLE

    @Column(nullable = false)
    private String propertyType; // 1BHK, 2BHK, etc.

    @ElementCollection
    @CollectionTable(name = "property_amenities", 
        joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "amenity")
    private List<String> amenities;

    @ManyToOne
    @JoinColumn(name = "landlord_id", referencedColumnName = "user_id")
    private User landlord;

    // Default constructor
    public Property() {}

    // Constructor with fields
    public Property(String title, String description, BigDecimal price, 
                   String location, String status, User landlord) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.location = location;
        this.status = status;
        this.landlord = landlord;
    }

    // Getters and Setters
    public Integer getPropertyId() {
        return property_id;
    }

    public void setPropertyId(Integer propertyId) {
        this.property_id = propertyId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }

    public User getLandlord() {
        return landlord;
    }

    public void setLandlord(User landlord) {
        this.landlord = landlord;
    }
} 