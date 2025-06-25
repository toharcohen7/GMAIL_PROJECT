package com.example.gmail_app_dth;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class UserViewModel extends ViewModel {

    private final UserRepository repository;
    private final MutableLiveData<String> registrationStatus;

    public UserViewModel() {
        repository = new UserRepository();
        registrationStatus = new MutableLiveData<>();
    }

    public LiveData<String> getRegistrationStatus() {
        return registrationStatus;
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
}
