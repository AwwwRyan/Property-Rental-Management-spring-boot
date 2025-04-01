package com.renting.RentingApplicaton.repository.auth;

import com.renting.RentingApplicaton.entity.auth.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    
    @Modifying
    void deleteByUser_UserId(Integer userId);  // Updated method name to match entity relationship
    
    Optional<RefreshToken> findByUser_UserId(Integer userId);
}
