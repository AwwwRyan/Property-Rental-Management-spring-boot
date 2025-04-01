package com.renting.RentingApplicaton.dto.response;

public class MessageResponse {
    private String message;

    // Default constructor
    public MessageResponse() {}

    // Constructor with parameter
    public MessageResponse(String message) {
        this.message = message;
    }

    // Getter and Setter
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
} 