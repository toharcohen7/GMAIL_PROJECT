package com.example.gmail_app_dth.entities;

import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;
import androidx.annotation.NonNull;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

@Entity(tableName = "users")
public class User {

    @SerializedName("_id")
    @PrimaryKey
    @NonNull
    private String id;

    private String userName;
    private final String firstName;
    private final String lastName;
    private final String gender;
    private final String birthDate;

    @SerializedName("image")
    @Expose
    @Ignore
    private String image;

    public User(@NonNull String id, String userName, String firstName, String lastName, String gender, String birthDate) {
        this.id = id;
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.birthDate = birthDate;
    }

    @Ignore
    public User(@NonNull String id, String userName, String firstName, String lastName, String gender, String birthDate, String image) {
        this(id, userName, firstName, lastName, gender, birthDate);
        this.image = image;
    }

    // Getters and Setters...

    @NonNull
    public String getId() { return id; }
    public void setId(@NonNull String id) { this.id = id; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getGender() { return gender; }
    public String getBirthDate() { return birthDate; }

    public String getImage() { return image; }
}

