package com.example.gmail_app_dth.repository;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import com.example.gmail_app_dth.AuthInterceptor;
import com.example.gmail_app_dth.requests.MailUpdateRequest;
import com.example.gmail_app_dth.interfaces.WebServiceAPI;
import com.example.gmail_app_dth.entities.Mail;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MailRepository {

    private final WebServiceAPI api;

    public MailRepository(String userId) {
        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(new AuthInterceptor(userId))
                .build();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://7d6d-79-181-175-112.ngrok-free.app/api/")
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        api = retrofit.create(WebServiceAPI.class);
    }

    public void fetchMailsByLabel(String labelName, MutableLiveData<List<Mail>> liveData) {
        api.getMailsByLabel(labelName).enqueue(new Callback<List<Mail>>() {
            @Override
            public void onResponse(@NonNull Call<List<Mail>> call, @NonNull Response<List<Mail>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    liveData.postValue(response.body());
                } else {
                    liveData.postValue(Collections.emptyList());
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Mail>> call, @NonNull Throwable t) {
                liveData.postValue(Collections.emptyList());
            }
        });
    }

    public void updateStarStatus(String mailId, boolean newStatus, Runnable onSuccess, Runnable onError) {
        MailUpdateRequest request = new MailUpdateRequest(newStatus, null, null,null,null,null);
        api.updateMails(mailId, request).enqueue(new Callback<Void>() {

            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    onSuccess.run();
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }


    public void searchMails(String query, MutableLiveData<List<Mail>> liveData) {
        Log.d("SEARCH_REPO", "Calling API with: " + query);
        api.searchMails(query).enqueue(new Callback<List<Mail>>() {
            @Override
            public void onResponse(@NonNull Call<List<Mail>> call, @NonNull Response<List<Mail>> response) {
                Log.d("SEARCH_REPO", "Response status: " + response.code());
                if (response.isSuccessful() && response.body() != null) {
                    Log.d("SEARCH_REPO", "Results count: " + response.body().size());
                    liveData.postValue(response.body());
                } else {
                    liveData.postValue(Collections.emptyList());
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Mail>> call, @NonNull Throwable t) {
                Log.e("SEARCH_REPO", "Failure: " + t.getMessage());
                liveData.postValue(Collections.emptyList());
            }
        });
    }

    public void updateMailReadStatus(String mailId, boolean newStatus, Runnable onSuccess, Runnable onError) {
        MailUpdateRequest request = new MailUpdateRequest(null, newStatus, null,null,null,null); // null ל־starred
        api.updateMails(mailId, request).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    onSuccess.run();
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }

    public void updateLabel(String mailId, String labelName, Runnable onSuccess, Runnable onError) {
        MailUpdateRequest request = new MailUpdateRequest(null, null, labelName,null,null,null); // null ל־starred ו־onRead
        api.updateMails(mailId, request).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    onSuccess.run();
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }
    public void deleteMail(String mailId, Runnable onSuccess, Runnable onError) {
        api.deleteMail(mailId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    onSuccess.run();
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }

    public void addUrlToBlacklist(String url, Runnable onSuccess, Runnable onError) {
        Map<String, String> body = new HashMap<>();
        body.put("url", url);

        api.addToBlacklist(body).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    onSuccess.run();
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }


    public void createMail(Consumer<String> onSuccess, Runnable onError) {
        api.createMail().enqueue(new Callback<Mail>() {
            @Override
            public void onResponse(@NonNull Call<Mail> call, @NonNull Response<Mail> response) {
                if (response.isSuccessful() && response.body() != null) {
                    onSuccess.accept(response.body().getId());
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Mail> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }

    public void updateMailAsDraft(String mailId, String subject, String content, List<String> receivers, Runnable onSuccess, Runnable onError) {
        MailUpdateRequest request = new MailUpdateRequest(
                null, // starred
                null, // onRead
                null, // labelName
                subject,
                content,
                receivers // receiversNames
        );
        updateMail(mailId, request, onSuccess, onError);
    }

    public void sendMail(String mailId, String to, String subject, String content, Runnable onSuccess, Runnable onError) {
        List<String> receivers = Arrays.asList(to.split(","));
        MailUpdateRequest request = new MailUpdateRequest(
                null, // starred
                null, // onRead
                "Sent", // labelName
                subject,
                content,
                receivers
        );
        updateMail(mailId, request, onSuccess, onError);
    }

    private void updateMail(String mailId, MailUpdateRequest request, Runnable onSuccess, Runnable onError) {
        api.updateMail(mailId, request).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    onSuccess.run();
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }




}
