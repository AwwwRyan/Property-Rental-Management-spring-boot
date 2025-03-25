package com.renting.RentingApplicaton.repository.appointment;

import com.renting.RentingApplicaton.entity.appointment.Appointment;
import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.entity.property.Property;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    // Find appointments by tenant
    List<Appointment> findByTenant(User tenant);
    
    // Find appointments by property
    List<Appointment> findByProperty(Property property);
    
    // Find appointments by property's landlord
    List<Appointment> findByProperty_Landlord(User landlord);
    
    // Find appointments by status
    List<Appointment> findByStatus(String status);
    
    // Find appointments by tenant and status
    List<Appointment> findByTenantAndStatus(User tenant, String status);
    
    // Find appointments by property and status
    List<Appointment> findByPropertyAndStatus(Property property, String status);
    
    // Find appointments for a specific date range
    List<Appointment> findByAppointmentTimeBetween(LocalDateTime start, LocalDateTime end);

    Long countByTenant(User tenant);
    Long countByProperty_Landlord(User landlord);
    Long countByTenantAndStatus(User tenant, String status);
    Long countByProperty_LandlordAndStatus(User landlord, String status);
    List<Appointment> findByTenantOrderByAppointmentTimeDesc(User tenant);
    List<Appointment> findByProperty_LandlordOrderByAppointmentTimeDesc(User landlord);
    Long countByTenantAndAppointmentTimeBetween(User tenant, LocalDateTime start, LocalDateTime end);
    Long countByProperty_LandlordAndAppointmentTimeBetween(User landlord, LocalDateTime start, LocalDateTime end);
}