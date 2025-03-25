package com.renting.RentingApplicaton.controller.auth;

import com.renting.RentingApplicaton.entity.auth.RefreshToken;
import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.repository.auth.UserRepository;
import com.renting.RentingApplicaton.service.auth.PasswordResetService;
import com.renting.RentingApplicaton.service.auth.RefreshTokenService;
import com.renting.RentingApplicaton.util.JwtUtil;
import com.renting.RentingApplicaton.exception.TokenRefreshException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final PasswordResetService passwordResetService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, RefreshTokenService refreshTokenService, PasswordResetService passwordResetService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokenService = refreshTokenService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email is already registered"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent() && passwordEncoder.matches(password, userOptional.get().getPassword())) {
            User user = userOptional.get();

            // Generate access token with authorities
            String accessToken = jwtUtil.generateAccessToken(
                email,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
            );
            
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

            Map<String, String> response = new HashMap<>();
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken.getToken());
            response.put("type", "Bearer");
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put("userId", user.getUserId().toString());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("error", "Invalid credentials"));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        Optional<RefreshToken> storedToken = refreshTokenService.findByToken(refreshToken);
        if (storedToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid refresh token"));
        }

        try {
            refreshTokenService.verifyExpiration(storedToken.get());
        } catch (TokenRefreshException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }

        // Generate a new access token
        User user = storedToken.get().getUser();
        String email = user.getEmail();
        String newAccessToken = jwtUtil.generateAccessToken(
            email,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );

        // Delete old refresh token and issue a new one
        refreshTokenService.deleteByUser(user);
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);

        return ResponseEntity.ok(Map.of(
                "accessToken", newAccessToken,
                "refreshToken", newRefreshToken.getToken()
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        try {
            String resetToken = passwordResetService.initiatePasswordReset(email);
            // In production, send this token via email
            // For testing, we'll return it in response
            return ResponseEntity.ok(Map.of(
                "message", "Password reset initiated successfully",
                "token", resetToken // Remove in production
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        try {
            passwordResetService.completePasswordReset(token, newPassword);
            return ResponseEntity.ok(Map.of(
                "message", "Password reset successful"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }
}
