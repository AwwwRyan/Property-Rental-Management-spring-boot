package com.renting.RentingApplicaton.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import com.renting.RentingApplicaton.entity.auth.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}