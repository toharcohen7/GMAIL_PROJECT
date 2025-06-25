package com.example.gmail_app_dth;

public class UserRegistrationRequest {
    public String userName;
    public String password;
    public String confirmPassword;
    public String firstName;
    public String lastName;
    public String gender;
    public String birthDate;
    public String image;

    public UserRegistrationRequest(String userName, String password, String confirmPassword,
                                   String firstName, String lastName, String gender,
                                   String birthDate, String image) {
        this.userName = userName;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.birthDate = birthDate;
        this.image = image;
    }
}
