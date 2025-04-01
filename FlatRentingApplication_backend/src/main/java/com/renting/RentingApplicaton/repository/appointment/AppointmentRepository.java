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

    // Find appointments by user (who is booking)
    List<Appointment> findByUserId(Integer userId);

    // Find appointments by property
    List<Appointment> findByProperty(Property property);

    // Find appointments by property's landlord
    List<Appointment> findByProperty_Landlord(User landlord);

    // Find appointments by status
    List<Appointment> findByStatus(String status);

    // Find appointments by user and status
    List<Appointment> findByUserIdAndStatus(Integer userId, String status);

    // Find appointments by property and status
    List<Appointment> findByPropertyAndStatus(Property property, String status);

    // Find appointments for a specific date range
    List<Appointment> findByAppointmentDateTimeBetween(LocalDateTime start, LocalDateTime end);

    Long countByUserId(Integer userId);
    Long countByProperty_Landlord(User landlord);
    Long countByUserIdAndStatus(Integer userId, String status);
    Long countByProperty_LandlordAndStatus(User landlord, String status);

    List<Appointment> findByUserIdOrderByAppointmentDateTimeDesc(Integer userId);
    List<Appointment> findByProperty_LandlordOrderByAppointmentDateTimeDesc(User landlord);

    Long countByUserIdAndAppointmentDateTimeBetween(Integer userId, LocalDateTime start, LocalDateTime end);
    Long countByProperty_LandlordAndAppointmentDateTimeBetween(User landlord, LocalDateTime start, LocalDateTime end);
}
