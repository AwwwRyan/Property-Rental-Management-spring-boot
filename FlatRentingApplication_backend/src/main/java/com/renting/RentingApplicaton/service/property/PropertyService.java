package com.renting.RentingApplicaton.service.property;

import com.renting.RentingApplicaton.dto.request.PropertyRequest;
import com.renting.RentingApplicaton.dto.response.PropertyResponse;
import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.entity.property.Property;
import com.renting.RentingApplicaton.exception.PropertyNotFoundException;
import com.renting.RentingApplicaton.repository.property.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    @Autowired
    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    // Get property by ID
    public Property getPropertyById(Integer propertyId) {
        return propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with ID: " + propertyId));
    }

    // Create a new property
    @Transactional
    public PropertyResponse addProperty(PropertyRequest request, User landlord) {
        Property property = new Property();
        property.setTitle(request.getTitle());
        property.setProperty_name(request.getPropertyName());
        property.setDescription(request.getDescription());
        property.setAddress(request.getAddress());
        property.setPrice(request.getPrice());
        property.setLocation(request.getLocation());
        property.setProperty_type(request.getPropertyType());
        property.setStatus("AVAILABLE");
        property.setNumber_of_rooms(request.getNumberOfRooms());
        property.setFurnished_status(request.getFurnishedStatus());
        property.setProperty_size(request.getPropertySize());
        property.setLandlord(landlord);

        LocalDateTime now = LocalDateTime.now();
        property.setCreated_at(now);
        property.setUpdated_at(now);

        Property savedProperty = propertyRepository.save(property);
        return convertToResponse(savedProperty);
    }

    // Get all properties
    public List<PropertyResponse> getAllProperties() {
        List<Property> properties = propertyRepository.findAll();
        if (properties.isEmpty()) {
            return List.of(); // Return an empty list instead of an error
        }
        return properties.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    // Get properties by landlord
    public List<PropertyResponse> getPropertiesByLandlord(User landlord) {
        return propertyRepository.findByLandlord(landlord)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Update property
    @Transactional
    public PropertyResponse updateProperty(Integer propertyId, PropertyRequest request) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException("Property with ID " + propertyId + " not found"));

        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setPrice(request.getPrice());
        property.setLocation(request.getLocation());
        property.setStatus(request.getStatus());
        property.setUpdated_at(LocalDateTime.now());

        return convertToResponse(propertyRepository.save(property));
    }

    // Delete property
    @Transactional
    public void deleteProperty(Integer propertyId) {
        if (!propertyRepository.existsById(propertyId)) {
            throw new PropertyNotFoundException("Property with ID " + propertyId + " not found");
        }
        propertyRepository.deleteById(propertyId);
    }

    // Search properties with filters
    public List<PropertyResponse> searchProperties(String location, BigDecimal minPrice, BigDecimal maxPrice, String status) {
        return propertyRepository.findPropertiesWithFilters(location, minPrice, maxPrice, status)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get available properties
    public List<PropertyResponse> getAvailableProperties() {
        return propertyRepository.findByStatus("AVAILABLE")
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Update property status
    @Transactional
    public PropertyResponse updatePropertyStatus(Integer propertyId, String status) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException("Property with ID " + propertyId + " not found"));

        property.setStatus(status);
        Property updatedProperty = propertyRepository.save(property);
        return convertToResponse(updatedProperty);
    }

    // Get property count by landlord
    public Long getPropertyCountByLandlord(User landlord) {
        return propertyRepository.countByLandlord(landlord);
    }

    // Advanced search
    public List<PropertyResponse> advancedSearch(String location, BigDecimal minPrice, BigDecimal maxPrice,
                                                 String propertyType, List<String> amenities, String sortBy) {
        return propertyRepository.findPropertiesWithAdvancedFilters(location, minPrice, maxPrice, propertyType, amenities, sortBy)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Convert Entity to Response DTO
    private PropertyResponse convertToResponse(Property property) {
        PropertyResponse response = new PropertyResponse();
        response.setPropertyId(property.getProperty_id());
        response.setTitle(property.getTitle());
        response.setDescription(property.getDescription());
        response.setPrice(property.getPrice());
        response.setLocation(property.getLocation());
        response.setStatus(property.getStatus());
        response.setPropertyType(property.getProperty_type());

        if (property.getLandlord() != null) {
            response.setLandlordId(property.getLandlord().getUserId());
            response.setLandlordName(property.getLandlord().getName());
        }

        return response;
    }
}
