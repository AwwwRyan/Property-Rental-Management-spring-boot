package com.renting.RentingApplicaton.service.appointment;

import com.renting.RentingApplicaton.entity.appointment.Appointment;
import com.renting.RentingApplicaton.entity.property.Property;
import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.repository.appointment.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    // Create new appointment
    @Transactional
    public Appointment createAppointment(Property property, User tenant, 
                                       LocalDateTime appointmentTime, String message) {
        Appointment appointment = new Appointment();
        appointment.setProperty(property);
        appointment.setTenant(tenant);
        appointment.setAppointmentTime(appointmentTime);
        appointment.setStatus("PENDING");
        appointment.setMessage(message);
        
        return appointmentRepository.save(appointment);
    }

    // Get appointment by ID
    public Appointment getAppointmentById(Integer appointmentId) {
        return appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    // Get tenant's appointments
    public List<Appointment> getTenantAppointments(User tenant) {
        return appointmentRepository.findByTenant(tenant);
    }

    // Get landlord's appointments
    public List<Appointment> getLandlordAppointments(User landlord) {
        return appointmentRepository.findByProperty_Landlord(landlord);
    }

    // Update appointment status
    @Transactional
    public Appointment updateAppointmentStatus(Integer appointmentId, String status) {
        Appointment appointment = getAppointmentById(appointmentId);
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    // Get appointments by property
    public List<Appointment> getAppointmentsByProperty(Property property) {
        return appointmentRepository.findByProperty(property);
    }

    // Get appointments by status
    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }

    // Get appointments for date range
    public List<Appointment> getAppointmentsForDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentTimeBetween(start, end);
    }

    // Get tenant's appointments by status
    public List<Appointment> getTenantAppointmentsByStatus(User tenant, String status) {
        return appointmentRepository.findByTenantAndStatus(tenant, status);
    }

    // Cancel appointment
    @Transactional
    public Appointment cancelAppointment(Integer appointmentId) {
        Appointment appointment = getAppointmentById(appointmentId);
        appointment.setStatus("CANCELLED");
        return appointmentRepository.save(appointment);
    }

    // Check if appointment time is available
    public boolean isTimeSlotAvailable(Property property, LocalDateTime proposedTime) {
        LocalDateTime endTime = proposedTime.plusHours(1); // Assuming 1-hour appointments
        List<Appointment> conflictingAppointments = appointmentRepository
            .findByAppointmentTimeBetween(proposedTime, endTime);
        return conflictingAppointments.isEmpty();
    }

    // Get appointment history with statistics
    public Map<String, Object> getAppointmentAnalytics(User user, String role) {
        Map<String, Object> analytics = new HashMap<>();
        
        if (role.equals("TENANT")) {
            // Tenant analytics
            analytics.put("totalAppointments", appointmentRepository.countByTenant(user));
            analytics.put("pendingAppointments", appointmentRepository.countByTenantAndStatus(user, "PENDING"));
            analytics.put("completedAppointments", appointmentRepository.countByTenantAndStatus(user, "COMPLETED"));
            analytics.put("cancelledAppointments", appointmentRepository.countByTenantAndStatus(user, "CANCELLED"));
            analytics.put("recentAppointments", appointmentRepository.findByTenantOrderByAppointmentTimeDesc(user));
        } else if (role.equals("LANDLORD")) {
            // Landlord analytics
            analytics.put("totalAppointments", appointmentRepository.countByProperty_Landlord(user));
            analytics.put("pendingAppointments", appointmentRepository.countByProperty_LandlordAndStatus(user, "PENDING"));
            analytics.put("completedAppointments", appointmentRepository.countByProperty_LandlordAndStatus(user, "COMPLETED"));
            analytics.put("cancelledAppointments", appointmentRepository.countByProperty_LandlordAndStatus(user, "CANCELLED"));
            analytics.put("recentAppointments", appointmentRepository.findByProperty_LandlordOrderByAppointmentTimeDesc(user));
        }
        
        return analytics;
    }

    // Get monthly appointment statistics
    public Map<String, Long> getMonthlyAppointmentStats(User user, String role, int year, int month) {
        LocalDateTime startOfMonth = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);
        
        Map<String, Long> monthlyStats = new HashMap<>();
        
        if (role.equals("TENANT")) {
            monthlyStats.put("total", appointmentRepository.countByTenantAndAppointmentTimeBetween(
                user, startOfMonth, endOfMonth));
        } else if (role.equals("LANDLORD")) {
            monthlyStats.put("total", appointmentRepository.countByProperty_LandlordAndAppointmentTimeBetween(
                user, startOfMonth, endOfMonth));
        }
        
        return monthlyStats;
    }
} 