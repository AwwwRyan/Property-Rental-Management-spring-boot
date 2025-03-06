package com.renting.RentingApplicaton.service;

import com.renting.RentingApplicaton.entity.RefreshToken;
import com.renting.RentingApplicaton.entity.User;
import com.renting.RentingApplicaton.repository.RefreshTokenRepository;
import com.renting.RentingApplicaton.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    // Generate a refresh token
    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusSeconds(7 * 24 * 60 * 60)); // 7 days expiry

        return refreshTokenRepository.save(refreshToken);
    }

    // Validate token
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public boolean isExpired(RefreshToken token) {
        return token.getExpiryDate().isBefore(Instant.now());
    }

    // Delete token
    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
