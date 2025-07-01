package com.example.gmail_app_dth.viewmodel;

import android.app.Application;
import android.content.Context;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.gmail_app_dth.repository.UserRepository;
import com.example.gmail_app_dth.requests.SignInRequest;
import com.example.gmail_app_dth.requests.UserRegistrationRequest;


public class UserViewModel extends AndroidViewModel {

    private final UserRepository repository;

    private final MutableLiveData<String> loginStatus = new MutableLiveData<>();
    private final MutableLiveData<String> registrationStatus = new MutableLiveData<>();


    public UserViewModel(@NonNull Application application) {
        super(application);
        repository = new UserRepository(application.getApplicationContext());
    }

    public void signIn(SignInRequest request, Context context) {
        repository.signIn(request, context, new UserRepository.LoginCallback() {
            @Override
            public void onSuccess(String token) {
                loginStatus.postValue("success");
            }

            @Override
            public void onError(String errorMessage) {
                loginStatus.postValue(errorMessage);
            }
        });
    }

    public LiveData<String> getLoginStatus() {
        return loginStatus;
    }

    public void register(UserRegistrationRequest request) {
        repository.register(request, new UserRepository.RegistrationCallback() {
            @Override
            public void onSuccess() {
                registrationStatus.postValue("success");
            }

            @Override
            public void onError(String errorMessage) {
                registrationStatus.postValue(errorMessage);
            }
        });
    }

    public LiveData<String> getRegistrationStatus() {
        return registrationStatus;
    }
}
