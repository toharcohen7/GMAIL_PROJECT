package com.example.gmail_app_dth;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface WebServiceAPI {

    @POST("/api/users")
    Call<Void> registerUser(@Body UserRegistrationRequest request);

    @POST("api/tokens")
    Call<ResponseBody> signIn(@Body SignInRequest request);

}
