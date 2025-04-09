package com.renting.RentingApplicaton.service.auth;

import com.renting.RentingApplicaton.dto.request.LoginRequest;
import com.renting.RentingApplicaton.dto.request.RegisterRequest;
import com.renting.RentingApplicaton.dto.response.AuthenticationResponse;
import com.renting.RentingApplicaton.entity.auth.User;
import com.renting.RentingApplicaton.repository.auth.UserRepository;
import com.renting.RentingApplicaton.util.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationService {
    
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthenticationService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthenticationResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());

        // Save user
        user = userRepository.save(user);

        // Generate access token
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), 
            java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole())));

        return new AuthenticationResponse(
            accessToken,
            user.getUserId(),
            user.getEmail(),
            user.getRole()
        );
    }

    public AuthenticationResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Get user details
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate access token
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), userDetails.getAuthorities());

        return new AuthenticationResponse(
            accessToken,
            user.getUserId(),
            user.getEmail(),
            user.getRole()
        );
    }

    public User getUserFromToken(String token) {
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
} 