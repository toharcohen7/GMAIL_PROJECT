package com.example.gmail_app_dth.requests;

public class SignInRequest {
    private final String userName;
    private final String password; // unused, for server communication usage

    public SignInRequest(String userName, String password) {
        this.userName = userName;
        this.password = password;
    }

    // Getters
    public String getUserName() {
        return userName;
    }


}
