package com.example.gmail_app_dth;

public class SignInRequest {
    private final String userName;
    private final String password;

    public SignInRequest(String userName, String password) {
        this.userName = userName;
        this.password = password;
    }

    // Getters
    public String getUserName() {
        return userName;
    }

    public String getPassword() {
        return password;
    }

}
