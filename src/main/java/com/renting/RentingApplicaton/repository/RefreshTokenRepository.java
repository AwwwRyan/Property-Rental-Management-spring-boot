package com.renting.RentingApplicaton.repository;

import com.renting.RentingApplicaton.entity.RefreshToken;
import com.renting.RentingApplicaton.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}
