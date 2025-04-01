package com.renting.RentingApplicaton.dto.response;

import com.renting.RentingApplicaton.entity.property.Property;

import java.math.BigDecimal;
import java.util.List;

public class PropertyResponse {
    private Integer propertyId;
    private String title;
    private String description;
    private BigDecimal price;
    private String location;
    private String status;
    private String propertyType;
    private List<String> amenities;
    private Integer landlordId;
    private String landlordName;

    // Inner class for landlord details
    public static class LandlordDTO {
        private Integer userId;
        private String name;
        private String email;
        // Getters and Setters
    }

    // Getters and Setters

    public Integer getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(Integer propertyId) {
        this.propertyId = propertyId;
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

    public Integer getLandlordId() {
        return landlordId;
    }

    public void setLandlordId(Integer landlordId) {
        this.landlordId = landlordId;
    }

    public String getLandlordName() {
        return landlordName;
    }

    public void setLandlordName(String landlordName) {
        this.landlordName = landlordName;
    }

    private PropertyResponse convertToResponse(Property property) {
        PropertyResponse response = new PropertyResponse();
        // Convert Property entity to PropertyResponse
        return response;
    }
}