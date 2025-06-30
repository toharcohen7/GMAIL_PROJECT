package com.example.gmail_app_dth.entities;

public class User {

    private String _id;
    private String userName;
    private String firstName;
    private String lastName;
    private String gender;
    private String birthDate;
    private String image;


    // גטרים
    public String getId() {
        return _id;
    }

    public String getUserName() {
        return userName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getGender() {
        return gender;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public String getImage() {
        return image;
    }

    @Override
    public String toString() {
        return "UserResponse{" +
                "id='" + _id + '\'' +
                ", userName='" + userName + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", gender='" + gender + '\'' +
                ", birthDate='" + birthDate + '\'' +
                ", image='" + image + '\'' +
                '}';
    }

}
