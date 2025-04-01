package com.renting.RentingApplicaton.entity.property;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDateTime;

import com.renting.RentingApplicaton.entity.auth.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer property_id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String property_name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String property_type;

    @Column(nullable = false)
    private String status;

    private Integer number_of_rooms;

    @Column(columnDefinition = "enum('furnished','semi-furnished','unfurnished')")
    private String furnished_status = "unfurnished";

    private BigDecimal property_size;

    @Column(updatable = false)
    private LocalDateTime created_at;

    private LocalDateTime updated_at;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
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

    public Integer getProperty_id() {
        return property_id;
    }

    public void setProperty_id(Integer property_id) {
        this.property_id = property_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getProperty_name() {
        return property_name;
    }

    public void setProperty_name(String property_name) {
        this.property_name = property_name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public String getProperty_type() {
        return property_type;
    }

    public void setProperty_type(String property_type) {
        this.property_type = property_type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getNumber_of_rooms() {
        return number_of_rooms;
    }

    public void setNumber_of_rooms(Integer number_of_rooms) {
        this.number_of_rooms = number_of_rooms;
    }

    public String getFurnished_status() {
        return furnished_status;
    }

    public void setFurnished_status(String furnished_status) {
        this.furnished_status = furnished_status;
    }

    public BigDecimal getProperty_size() {
        return property_size;
    }

    public void setProperty_size(BigDecimal property_size) {
        this.property_size = property_size;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
    }

    public User getLandlord() {
        return landlord;
    }

    public void setLandlord(User landlord) {
        this.landlord = landlord;
    }
}