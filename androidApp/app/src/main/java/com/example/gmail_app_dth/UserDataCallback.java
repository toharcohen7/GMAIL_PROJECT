package com.example.gmail_app_dth;
import com.example.gmail_app_dth.UserResponse;
public interface UserDataCallback {
    void onSuccess(UserResponse user);
    void onError(String errorMessage);
}
