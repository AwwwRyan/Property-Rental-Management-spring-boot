package com.renting.RentingApplicaton.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.renting.RentingApplicaton.security.JwtAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/api/auth/**")  // Disable CSRF for auth endpoints
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints (no authentication required)
                .requestMatchers(
                    "/api/auth/login",
                    "/api/auth/register",
                    "/api/auth/refresh-token",
                    "/api/auth/forgot-password",
                    "/api/auth/reset-password"
                ).permitAll()
                
                // Public property endpoints
                .requestMatchers(
                    "/api/properties",              // GET all properties
                    "/api/properties/search",       // Search properties
                    "/api/properties/{id}"          // GET single property
                ).permitAll()
                
                // Tenant-only endpoints
                .requestMatchers(
                    "/api/appointments",                    // Create appointment
                    "/api/appointments/my-appointments",    // Get tenant's appointments
                    "/api/appointments/{id}/cancel"         // Cancel appointment
                ).hasRole("TENANT")
                
                // Landlord-only endpoints
                .requestMatchers(
                    "/api/properties/add",                  // Add property
                    "/api/properties/my-properties",        // Get landlord's properties
                    "/api/properties/{id}/update",          // Update property
                    "/api/properties/{id}/delete",          // Delete property
                    "/api/appointments/landlord-appointments", // Get landlord's appointments
                    "/api/appointments/{id}/status"         // Update appointment status
                ).hasRole("LANDLORD")
                
                // Admin-only endpoints
                .requestMatchers(
                    "/api/admin/**",                       // All admin endpoints
                    "/api/admin/dashboard",                // Admin dashboard
                    "/api/admin/users",                    // User management
                    "/api/admin/properties",               // Property management
                    "/api/admin/appointments"              // Appointment management
                ).hasRole("ADMIN")
                
                // Analytics endpoints (accessible by both TENANT and LANDLORD)
                .requestMatchers(
                    "/api/appointments/analytics",
                    "/api/appointments/statistics"
                ).hasAnyRole("TENANT", "LANDLORD")
                
                // Any other request needs authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Frontend URL
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
