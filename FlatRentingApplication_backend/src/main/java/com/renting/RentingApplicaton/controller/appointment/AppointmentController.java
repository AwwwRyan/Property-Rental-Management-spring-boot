package com.renting.RentingApplicaton.controller.appointment;

import com.renting.RentingApplicaton.entity.appointment.Appointment;
import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.service.appointment.AppointmentService;
import com.renting.RentingApplicaton.service.property.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final PropertyService propertyService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService, 
                               PropertyService propertyService) {
        this.appointmentService = appointmentService;
        this.propertyService = propertyService;
    }

    // Book appointment (tenant only)
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        User tenant = (User) authentication.getPrincipal();
        
        Integer propertyId = Integer.valueOf(request.get("propertyId"));
        LocalDateTime appointmentTime = LocalDateTime.parse(request.get("appointmentTime"));
        String message = request.get("message");

        return ResponseEntity.ok(
            appointmentService.createAppointment(
                propertyService.getPropertyById(propertyId),
                tenant,
                appointmentTime,
                message
            )
        );
    }

    // Get tenant's appointments
    @GetMapping("/my-appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(
            Authentication authentication) {
        User tenant = (User) authentication.getPrincipal();
        return ResponseEntity.ok(appointmentService.getTenantAppointments(tenant));
    }

    // Get landlord's appointments
    @GetMapping("/landlord-appointments")
    public ResponseEntity<List<Appointment>> getLandlordAppointments(
            Authentication authentication) {
        User landlord = (User) authentication.getPrincipal();
        return ResponseEntity.ok(appointmentService.getLandlordAppointments(landlord));
    }

    // Update appointment status (landlord only)
    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(id, status));
    }

    // Cancel appointment (tenant or landlord)
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Integer id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }
} 