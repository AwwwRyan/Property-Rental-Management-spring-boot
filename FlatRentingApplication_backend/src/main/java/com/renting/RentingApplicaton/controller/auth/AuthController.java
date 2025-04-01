package com.renting.RentingApplicaton.controller.auth;

import com.renting.RentingApplicaton.dto.request.LoginRequest;
import com.renting.RentingApplicaton.dto.request.RegisterRequest;
import com.renting.RentingApplicaton.dto.request.LogoutRequest;
import com.renting.RentingApplicaton.dto.response.AuthenticationResponse;
import com.renting.RentingApplicaton.dto.response.MessageResponse;
import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.service.auth.AuthenticationService;
import com.renting.RentingApplicaton.service.auth.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    private final AuthenticationService authenticationService;
    private final RefreshTokenService refreshTokenService;

    @Autowired
    public AuthController(
            AuthenticationService authenticationService,
            RefreshTokenService refreshTokenService) {
        this.authenticationService = authenticationService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody LoginRequest request) {
        AuthenticationResponse response = authenticationService.login(request);
        
        // Create refresh token
        refreshTokenService.createRefreshToken(response.getUserId());  // Use getUserId() instead of User object
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(
            @RequestBody String refreshToken) {
        return ResponseEntity.ok(authenticationService.refreshToken(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutRequest request) {
        User user = authenticationService.getUserFromToken(request.getToken());
        if (user != null) {
            // Delete refresh token using userId
            refreshTokenService.deleteByUserId(user.getUserId());
            return ResponseEntity.ok(new MessageResponse("Logged out successfully!"));
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Invalid token"));
    }
}
