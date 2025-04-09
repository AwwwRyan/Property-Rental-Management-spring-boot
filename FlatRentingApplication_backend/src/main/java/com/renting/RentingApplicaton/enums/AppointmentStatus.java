package com.renting.RentingApplicaton.enums;

public enum AppointmentStatus {
    PENDING,     // Initial state when appointment is created
    APPROVED,    // Landlord has approved the appointment
    REJECTED,    // Landlord has rejected the appointment
    CANCELLED,   // Tenant has cancelled the appointment
    COMPLETED    // Appointment has been completed
} 