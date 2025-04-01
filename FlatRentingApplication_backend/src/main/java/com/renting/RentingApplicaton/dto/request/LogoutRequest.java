package com.renting.RentingApplicaton.dto.request;

public class LogoutRequest {
    private String token;

    // Default constructor
    public LogoutRequest() {}

    // Constructor with parameter
    public LogoutRequest(String token) {
        this.token = token;
    }

    // Getter and Setter
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
} 