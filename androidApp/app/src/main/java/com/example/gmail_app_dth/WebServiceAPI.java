package com.example.gmail_app_dth;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface WebServiceAPI {

    @POST("/api/users")
    Call<Void> registerUser(@Body UserRegistrationRequest request);
}
