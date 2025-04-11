package com.renting.RentingApplicaton.controller.appointment;

import com.renting.RentingApplicaton.dto.response.PropertyResponse;
import com.renting.RentingApplicaton.entity.appointment.Appointment;
import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.entity.property.Property;
import com.renting.RentingApplicaton.exception.PropertyNotFoundException;
import com.renting.RentingApplicaton.repository.auth.UserRepository;
import com.renting.RentingApplicaton.repository.property.PropertyRepository;
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
    private final UserRepository userRepository;
    private final PropertyService propertyService;

    @Autowired
    public AppointmentController(
            AppointmentService appointmentService,
            UserRepository userRepository,
            PropertyService propertyService) {
        this.appointmentService = appointmentService;
        this.userRepository = userRepository;
        this.propertyService = propertyService;
    }

    // Book appointment (tenant only)
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer propertyId = Integer.valueOf(request.get("propertyId"));
        LocalDateTime appointmentDateTime = LocalDateTime.parse(request.get("appointmentDateTime"));
        String message = request.get("message");

        return ResponseEntity.ok(
                appointmentService.createAppointment(
                        propertyId,
                        user.getUserId(),
                        appointmentDateTime,
                        message
                )
        );
    }

    // Get tenant's appointments
    @GetMapping("/my-appointments")
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        return ResponseEntity.ok(appointmentService.getUserAppointments(user));
    }

    // Get landlord's appointments
    @GetMapping("/landlord-appointments")
    public ResponseEntity<List<Appointment>> getLandlordAppointments(Authentication authentication) {
        String email = authentication.getName();
        User landlord = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(appointmentService.getLandlordAppointments(landlord));
    }

    // Update appointment status (landlord only)
    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PUT, RequestMethod.PATCH})
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable("id") Integer appointmentId,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        return ResponseEntity.ok(appointmentService.updateAppointmentStatus(appointmentId, status));
    }

    // Cancel appointment (tenant or landlord)
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable("id") Integer appointmentId) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(appointmentId));
    }
} 