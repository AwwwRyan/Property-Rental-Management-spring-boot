package com.renting.RentingApplicaton.service.appointment;

import com.renting.RentingApplicaton.entity.appointment.Appointment;
import com.renting.RentingApplicaton.entity.property.Property;
import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.repository.appointment.AppointmentRepository;
import com.renting.RentingApplicaton.repository.property.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PropertyRepository propertyRepository;

    @Autowired
    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PropertyRepository propertyRepository) {
        this.appointmentRepository = appointmentRepository;
        this.propertyRepository = propertyRepository;
    }

    // Create new appointment
    @Transactional
    public Appointment createAppointment(Integer propertyId, Integer userId,
                                       LocalDateTime appointmentDateTime, String message) {
        // Get fresh Property instance from database
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        Appointment appointment = new Appointment();
        appointment.setProperty(property);
        appointment.setUserId(userId);
        appointment.setAppointmentDateTime(appointmentDateTime);
        appointment.setStatus("PENDING");
        appointment.setMessage(message);

        return appointmentRepository.save(appointment);
    }

    // Get appointment by ID
    public Appointment getAppointmentById(Integer appointmentId) {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
    }

    // Get user's appointments
    public List<Appointment> getUserAppointments(User user) {
        return appointmentRepository.findByUserId(user.getUserId());
    }

    // Get appointments by date range
    public List<Appointment> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentDateTimeBetween(start, end);
    }

    // Get appointments by user and status
    public List<Appointment> getAppointmentsByUserAndStatus(User user, String status) {
        return appointmentRepository.findByUserIdAndStatus(user.getUserId(), status);
    }

    // Get appointments by property and status
    public List<Appointment> getAppointmentsByPropertyAndStatus(Property property, String status) {
        return appointmentRepository.findByPropertyAndStatus(property, status);
    }

    // Get appointments for date range
    public List<Appointment> getAppointmentsForDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentDateTimeBetween(start, end);
    }

    // Get user statistics
    public Map<String, Object> getUserStatistics(User user) {
        Map<String, Object> statistics = new HashMap<>();
        
        statistics.put("totalAppointments", appointmentRepository.countByUserId(user.getUserId()));
        statistics.put("pendingAppointments", appointmentRepository.countByUserIdAndStatus(user.getUserId(), "PENDING"));
        statistics.put("approvedAppointments", appointmentRepository.countByUserIdAndStatus(user.getUserId(), "APPROVED"));
        statistics.put("rejectedAppointments", appointmentRepository.countByUserIdAndStatus(user.getUserId(), "REJECTED"));
        statistics.put("recentAppointments", appointmentRepository.findByUserIdOrderByAppointmentDateTimeDesc(user.getUserId()));
        
        return statistics;
    }

    // Get landlord statistics
    public Map<String, Object> getLandlordStatistics(User landlord) {
        Map<String, Object> statistics = new HashMap<>();
        
        statistics.put("recentAppointments", 
            appointmentRepository.findByProperty_LandlordOrderByAppointmentDateTimeDesc(landlord));
        
        return statistics;
    }

    // Get appointment counts for date range
    public Map<String, Long> getAppointmentCounts(User user, LocalDateTime start, LocalDateTime end) {
        Map<String, Long> counts = new HashMap<>();
        
        if (user.getRole().equals("TENANT")) {
            counts.put("appointments", 
                appointmentRepository.countByUserIdAndAppointmentDateTimeBetween(
                    user.getUserId(), start, end));
        } else {
            counts.put("appointments", 
                appointmentRepository.countByProperty_LandlordAndAppointmentDateTimeBetween(
                    user, start, end));
        }
        
        return counts;
    }

    // Get landlord's appointments
    @Transactional(readOnly = true)
    public List<Appointment> getLandlordAppointments(User landlord) {
        return appointmentRepository.findByProperty_Landlord(landlord);
    }

    // Update appointment status
    @Transactional
    public Appointment updateAppointmentStatus(Integer appointmentId, String status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        // Validate status
        if (!isValidStatus(status)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
        
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    // Cancel appointment
    @Transactional
    public Appointment cancelAppointment(Integer appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        // Only allow cancellation of pending or approved appointments
        if (!appointment.getStatus().equals("PENDING") && !appointment.getStatus().equals("APPROVED")) {
            throw new IllegalStateException("Cannot cancel appointment with status: " + appointment.getStatus());
        }
        
        appointment.setStatus("CANCELLED");
        return appointmentRepository.save(appointment);
    }

    // Helper method to validate status
    private boolean isValidStatus(String status) {
        return Arrays.asList("PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED")
                .contains(status.toUpperCase());
    }
}
