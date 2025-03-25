package com.renting.RentingApplicaton.service.auth;

import com.renting.RentingApplicaton.entity.auth.PasswordResetToken;
import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.repository.auth.PasswordResetTokenRepository;
import com.renting.RentingApplicaton.repository.auth.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${password.reset.token.expiration:3600000}")
    private Long resetTokenExpirationMs;

    public PasswordResetService(UserRepository userRepository,
                              PasswordResetTokenRepository tokenRepository,
                              PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public String initiatePasswordReset(String email) {
        // Find user by email
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete any existing tokens for this user
        tokenRepository.deleteByUser(user);

        // Generate new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(
            token,
            user,
            Instant.now().plusMillis(resetTokenExpirationMs)
        );

        tokenRepository.save(resetToken);
        return token;
    }

    @Transactional
    public void completePasswordReset(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        // Check if token is expired
        if (resetToken.getExpiryDate().isBefore(Instant.now())) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Reset token has expired");
        }

        // Update password
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete used token
        tokenRepository.delete(resetToken);
    }
} 