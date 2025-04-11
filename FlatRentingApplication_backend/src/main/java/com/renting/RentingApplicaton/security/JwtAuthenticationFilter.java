package com.renting.RentingApplicaton.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.renting.RentingApplicaton.util.JwtUtil;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        boolean shouldNotFilter = path.startsWith("/api/auth/login") ||
                                path.startsWith("/api/auth/register") ||
                                path.startsWith("/api/auth/forgot-password") ||
                                path.startsWith("/api/auth/reset-password");
        
        System.out.println("Path: " + path + ", Should not filter: " + shouldNotFilter);
        return shouldNotFilter;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        if (shouldNotFilter(request)) {
            System.out.println("Skipping JWT filter for path: " + request.getServletPath());
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization header: " + (authHeader != null ? "Present" : "Missing"));
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            System.out.println("JWT token: " + jwt.substring(0, Math.min(20, jwt.length())) + "...");
            
            if (jwtUtil.validateToken(jwt)) {
                System.out.println("JWT token is valid");
                String email = jwtUtil.extractEmail(jwt);
                System.out.println("Extracted email: " + email);
                
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                System.out.println("User authorities: " + userDetails.getAuthorities());
                
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("Authentication set in SecurityContext");
            } else {
                System.out.println("JWT token is invalid");
            }
        } else {
            System.out.println("No valid Authorization header found");
        }
        
        filterChain.doFilter(request, response);
    }
} 