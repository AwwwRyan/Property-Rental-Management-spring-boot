package com.renting.RentingApplicaton.entity.appointment;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.entity.property.Property;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer appointment_id;

    @ManyToOne
    @JoinColumn(name = "property_id", referencedColumnName = "property_id")
    private Property property;

    @ManyToOne
    @JoinColumn(name = "tenant_id", referencedColumnName = "user_id")
    private User tenant;

    @Column(nullable = false)
    private LocalDateTime appointmentTime;

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED, COMPLETED

    private String message; // Optional message from tenant

    // Default constructor
    public Appointment() {}

    // Constructor with fields
    public Appointment(Property property, User tenant, LocalDateTime appointmentTime, 
                      String status, String message) {
        this.property = property;
        this.tenant = tenant;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.message = message;
    }

    // Getters and Setters
    public Integer getAppointmentId() {
        return appointment_id;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointment_id = appointmentId;
    }

    public Property getProperty() {
        return property;
    }

    public void setProperty(Property property) {
        this.property = property;
    }

    public User getTenant() {
        return tenant;
    }

    public void setTenant(User tenant) {
        this.tenant = tenant;
    }

    public LocalDateTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalDateTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
} 