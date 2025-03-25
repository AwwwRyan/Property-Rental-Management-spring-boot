package com.renting.RentingApplicaton.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import com.renting.RentingApplicaton.entity.auth.RefreshToken;
import com.renting.RentingApplicaton.entity.auth.User;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}
