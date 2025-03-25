package com.renting.RentingApplicaton.service.property;

import com.renting.RentingApplicaton.dto.request.PropertyRequest;
import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.entity.property.Property;
import com.renting.RentingApplicaton.repository.property.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    @Autowired
    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    // Create a new property
    @Transactional
    public Property addProperty(PropertyRequest request, User landlord) {
        Property property = new Property();
        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setPrice(request.getPrice());
        property.setLocation(request.getLocation());
        property.setPropertyType(request.getPropertyType());
        property.setAmenities(request.getAmenities());
        property.setStatus("AVAILABLE");
        property.setLandlord(landlord);
        
        return propertyRepository.save(property);
    }

    // Get all properties
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    // Get property by ID
    public Property getPropertyById(Integer propertyId) {
        return propertyRepository.findById(propertyId)
            .orElseThrow(() -> new RuntimeException("Property not found"));
    }

    // Get properties by landlord
    public List<Property> getPropertiesByLandlord(User landlord) {
        return propertyRepository.findByLandlord(landlord);
    }

    // Update property
    @Transactional
    public Property updateProperty(Integer propertyId, Property propertyDetails) {
        Property property = getPropertyById(propertyId);
        
        property.setTitle(propertyDetails.getTitle());
        property.setDescription(propertyDetails.getDescription());
        property.setPrice(propertyDetails.getPrice());
        property.setLocation(propertyDetails.getLocation());
        property.setStatus(propertyDetails.getStatus());
        
        return propertyRepository.save(property);
    }

    // Delete property
    @Transactional
    public void deleteProperty(Integer propertyId) {
        propertyRepository.deleteById(propertyId);
    }

    // Search properties with filters
    public List<Property> searchProperties(String location, BigDecimal minPrice, 
                                         BigDecimal maxPrice, String status) {
        return propertyRepository.findPropertiesWithFilters(location, minPrice, maxPrice, status);
    }

    // Get available properties
    public List<Property> getAvailableProperties() {
        return propertyRepository.findByStatus("AVAILABLE");
    }

    // Update property status
    @Transactional
    public Property updatePropertyStatus(Integer propertyId, String status) {
        Property property = getPropertyById(propertyId);
        property.setStatus(status);
        return propertyRepository.save(property);
    }

    // Get property count by landlord
    public Long getPropertyCountByLandlord(User landlord) {
        return propertyRepository.countByLandlord(landlord);
    }

    // Add this method to your existing PropertyService.java
    public List<Property> advancedSearch(
        String location, 
        BigDecimal minPrice, 
        BigDecimal maxPrice, 
        String propertyType,    // e.g., "1BHK", "2BHK", etc.
        List<String> amenities, // e.g., ["parking", "gym", "security"]
        String sortBy          // e.g., "price_asc", "price_desc"
    ) {
        // Implementation will require adding these fields to Property entity first
        return propertyRepository.findPropertiesWithAdvancedFilters(
            location, 
            minPrice, 
            maxPrice, 
            propertyType, 
            amenities,
            sortBy
        );
    }
} 