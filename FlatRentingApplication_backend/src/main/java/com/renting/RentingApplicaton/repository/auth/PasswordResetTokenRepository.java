package com.renting.RentingApplicaton.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import com.renting.RentingApplicaton.entity.auth.PasswordResetToken;
import com.renting.RentingApplicaton.entity.auth.User;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);
} 