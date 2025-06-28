package com.example.gmail_app_dth;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.MutableLiveData;

import java.util.Collections;
import java.util.List;

import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class LabelRepository {

    private final WebServiceAPI api;

    public LabelRepository(Context context) {
        SharedPreferences prefs = context.getSharedPreferences("auth", Context.MODE_PRIVATE);
        String userId = prefs.getString("userId", null);

        if (userId == null) {
            Log.e("LabelRepository", "Missing userId in SharedPreferences");
        }

        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(new AuthInterceptor(userId))
                .build();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://7539-79-181-175-112.ngrok-free.app/api/")
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        api = retrofit.create(WebServiceAPI.class);
    }

    public void createLabel(LabelRequest request, MutableLiveData<Boolean> result) {
        api.createLabel(request).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                result.postValue(response.isSuccessful());
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                result.postValue(false);
            }
        });
    }

    public void fetchLabels(MutableLiveData<List<Label>> labelsLiveData) {
        api.getLabels().enqueue(new Callback<List<Label>>() {
            @Override
            public void onResponse(@NonNull Call<List<Label>> call, @NonNull Response<List<Label>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    labelsLiveData.postValue(response.body());
                } else {
                    labelsLiveData.postValue(Collections.emptyList());
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Label>> call, @NonNull Throwable t) {
                labelsLiveData.postValue(Collections.emptyList());
            }
        });
    }

}
