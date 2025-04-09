package com.renting.RentingApplicaton.dto.response;

public class AuthenticationResponse {
    private String accessToken;
    private Integer userId;
    private String email;
    private String role;

    // Default constructor
    public AuthenticationResponse() {
    }

    // Constructor with all fields
    public AuthenticationResponse(String accessToken, Integer userId, String email, String role) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    // Getters and Setters
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
} 