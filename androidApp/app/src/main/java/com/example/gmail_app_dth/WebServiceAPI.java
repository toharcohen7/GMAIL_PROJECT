package com.example.gmail_app_dth;

import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface WebServiceAPI {

    @POST("users")
    Call<Void> registerUser(@Body UserRegistrationRequest request);

    @POST("tokens")
    Call<ResponseBody> signIn(@Body SignInRequest request);

    @POST("labels")
    Call<Void> createLabel(@Body LabelRequest request);

    @GET("users/me")
    Call<UserResponse> getCurrentUser(@Header("Authorization") String token);

    @GET("labels")
    Call<List<Label>> getLabels();

    @GET("mails")
    Call<List<Mail>> getMailsByLabel(@Query("labelName") String labelName);

    @PATCH("mails/{id}")
    Call<Void> updateMailStarred(
            @Path("id") String mailId,
            @Body MailUpdateRequest request
    );

    @GET("users/{id}")
    Call<UserResponse> getUserById(@Path("id") String userId);


}
