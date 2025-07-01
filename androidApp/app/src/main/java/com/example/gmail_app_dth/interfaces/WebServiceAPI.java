package com.example.gmail_app_dth.interfaces;

import com.example.gmail_app_dth.requests.LabelRequest;
import com.example.gmail_app_dth.requests.MailUpdateRequest;
import com.example.gmail_app_dth.requests.SignInRequest;
import com.example.gmail_app_dth.requests.UserRegistrationRequest;
import com.example.gmail_app_dth.entities.User;
import com.example.gmail_app_dth.entities.Label;
import com.example.gmail_app_dth.entities.Mail;

import java.util.List;
import java.util.Map;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
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
    Call<User> getCurrentUser(@Header("Authorization") String token);

    @GET("labels")
    Call<List<Label>> getLabels();

    @GET("mails")
    Call<List<Mail>> getMailsByLabel(@Query("labelName") String labelName);
    @GET("mails")
    Call<List<Mail>> getMailsByLabel(@Query("labelName") String labelName, @Query("offset") int offset);


    @PATCH("mails/{id}")
    Call<Void> updateMails(
            @Path("id") String mailId,
            @Body MailUpdateRequest request
    );

    @GET("users/{id}")
    Call<User> getUserById(@Path("id") String userId);

    @GET("mails/search/{query}")
    Call<List<Mail>> searchMails(@Path("query") String query);

    @DELETE("mails/{id}")
    Call<Void> deleteMail(@Path("id") String mailId);

    @POST("blacklist")
    Call<Void> addToBlacklist(@Body Map<String, String> body);

    @POST("mails")
    Call<Mail> createMail();

    @PATCH("mails/{id}")
    Call<Void> updateMail(@Path("id") String mailId, @Body MailUpdateRequest request);

    @PATCH("labels/{labelName}")
    Call<Void> updateLabel(@Path("labelName") String labelName, @Body LabelRequest request);

    @DELETE("labels/{labelName}")
    Call<Void> deleteLabel(@Path("labelName") String labelName);



}
