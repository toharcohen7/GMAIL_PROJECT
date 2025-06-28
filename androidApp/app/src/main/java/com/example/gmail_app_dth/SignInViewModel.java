package com.example.gmail_app_dth;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

public class SignInViewModel extends AndroidViewModel {

    private final UserRepository repository;
    private final MutableLiveData<String> loginStatus = new MutableLiveData<>();

    public SignInViewModel(@NonNull Application application) {
        super(application);
        repository = new UserRepository();
    }

    public LiveData<String> getLoginStatus() {
        return loginStatus;
    }

    public void signIn(SignInRequest request, Context context) {
        repository.signIn(request, context, new UserRepository.LoginCallback() {
            @Override
            public void onSuccess(String token) {
                // saveToken(token); ← לא חובה, נשמר כבר בתוך fetchUserData
                loginStatus.postValue("success");
            }

            @Override
            public void onError(String errorMessage) {
                loginStatus.postValue(errorMessage);
            }
        });
    }

}
