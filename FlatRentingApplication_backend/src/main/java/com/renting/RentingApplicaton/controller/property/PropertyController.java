package com.renting.RentingApplicaton.controller.property;

import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.entity.property.Property;
import com.renting.RentingApplicaton.service.property.PropertyService;
import com.renting.RentingApplicaton.dto.request.PropertyRequest;
import com.renting.RentingApplicaton.dto.response.PropertyResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:3000")
public class PropertyController {

    private final PropertyService propertyService;

    @Autowired
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // List all properties (public)
    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    // Get single property
    @GetMapping("/{id}")
    public ResponseEntity<Property> getProperty(@PathVariable Integer id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    // Add new property (landlord only)
    @PostMapping
    public ResponseEntity<PropertyResponse> addProperty(
            @RequestBody PropertyRequest request,
            Authentication authentication) {
        User landlord = (User) authentication.getPrincipal();
        Property property = propertyService.addProperty(request, landlord);
        return ResponseEntity.ok(convertToResponse(property));
    }

    private PropertyResponse convertToResponse(Property property) {
        PropertyResponse response = new PropertyResponse();
        // Convert Property entity to PropertyResponse
        return response;
    }

    // Update property (landlord only)
    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Integer id, 
                                                 @RequestBody Property property) {
        return ResponseEntity.ok(propertyService.updateProperty(id, property));
    }

    // Delete property (landlord only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProperty(@PathVariable Integer id) {
        propertyService.deleteProperty(id);
        return ResponseEntity.ok().build();
    }

    // Search properties
    @GetMapping("/search")
    public ResponseEntity<List<Property>> searchProperties(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(
            propertyService.searchProperties(location, minPrice, maxPrice, status)
        );
    }

    // Get landlord's properties
    @GetMapping("/my-properties")
    public ResponseEntity<List<Property>> getMyProperties(Authentication authentication) {
        User landlord = (User) authentication.getPrincipal();
        return ResponseEntity.ok(propertyService.getPropertiesByLandlord(landlord));
    }
} 