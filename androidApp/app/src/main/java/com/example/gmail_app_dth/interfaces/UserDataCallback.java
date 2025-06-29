package com.example.gmail_app_dth.interfaces;
import com.example.gmail_app_dth.entities.User;
public interface UserDataCallback {
    void onSuccess(User user);
    void onError(String errorMessage);
}
