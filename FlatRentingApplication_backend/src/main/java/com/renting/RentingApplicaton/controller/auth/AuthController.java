package com.renting.RentingApplicaton.controller.auth;

import com.renting.RentingApplicaton.dto.request.LoginRequest;
import com.renting.RentingApplicaton.dto.request.RegisterRequest;
import com.renting.RentingApplicaton.dto.request.LogoutRequest;
import com.renting.RentingApplicaton.dto.response.AuthenticationResponse;
import com.renting.RentingApplicaton.dto.response.MessageResponse;
import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.service.auth.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {
    private final AuthenticationService authenticationService;

    @Autowired
    public AuthController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutRequest request) {
        return ResponseEntity.ok(new MessageResponse("Logged out successfully!"));
    }
}
