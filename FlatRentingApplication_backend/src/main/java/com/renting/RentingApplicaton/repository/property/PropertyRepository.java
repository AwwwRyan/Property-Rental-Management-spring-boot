package com.renting.RentingApplicaton.repository.property;

import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.entity.property.Property;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Integer> {
    // Basic CRUD operations are inherited from JpaRepository

    // Find by landlord
    List<Property> findByLandlord(User landlord);
    
    // Find by status
    List<Property> findByStatus(String status);
    
    // Find by landlord and status
    List<Property> findByLandlordAndStatus(User landlord, String status);
    
    // Search properties by location
    List<Property> findByLocationContainingIgnoreCase(String location);
    
    // Find properties within price range
    List<Property> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    // Find properties by title containing keyword
    List<Property> findByTitleContainingIgnoreCase(String keyword);
    
    // Custom query to find properties with filters
    @Query("SELECT p FROM Property p WHERE " +
           "(:location IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:status IS NULL OR p.status = :status)")
    List<Property> findPropertiesWithFilters(
        @Param("location") String location,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("status") String status
    );
    
    // Count properties by landlord
    Long countByLandlord(User landlord);
    
    // Count properties by status
    Long countByStatus(String status);

    @Query("SELECT DISTINCT p FROM Property p WHERE " +
           "(:location IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:propertyType IS NULL OR p.property_type = :propertyType)")
    List<Property> findPropertiesWithAdvancedFilters(
        @Param("location") String location,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("propertyType") String propertyType,
        @Param("amenities") List<String> amenities,
        @Param("sortBy") String sortBy
    );

    // Add this query method for advanced filters
    @Query("SELECT p FROM Property p WHERE " +
           "(:location IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:propertyType IS NULL OR p.property_type = :propertyType) AND " +
           "(:sortBy IS NULL OR 1=1) " + // Handle sorting in service layer
           "ORDER BY CASE " +
           "    WHEN :sortBy = 'price_asc' THEN p.price END ASC, " +
           "    CASE WHEN :sortBy = 'price_desc' THEN p.price END DESC")
    List<Property> findPropertiesWithAdvancedFilters(
        @Param("location") String location,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("propertyType") String propertyType,
        @Param("sortBy") String sortBy
    );
} 