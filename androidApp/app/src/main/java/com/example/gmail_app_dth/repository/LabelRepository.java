package com.example.gmail_app_dth.repository;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.gmail_app_dth.AuthInterceptor;
import com.example.gmail_app_dth.dao.LabelDao;
import com.example.gmail_app_dth.entities.Label;
import com.example.gmail_app_dth.interfaces.WebServiceAPI;
import com.example.gmail_app_dth.requests.LabelRequest;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class LabelRepository {

    private final WebServiceAPI api;
    private final LabelDao labelDao;
    private final ExecutorService executor;
    private final MutableLiveData<List<Label>> internalLabelLiveData = new MutableLiveData<>();

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
                .baseUrl("https://7d6d-79-181-175-112.ngrok-free.app/api/")
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        api = retrofit.create(WebServiceAPI.class);

        AppDatabase db = LocalDatabase.getInstance(context);
        labelDao = db.labelDao();
        executor = Executors.newSingleThreadExecutor();
    }

    public void createLabel(LabelRequest request, MutableLiveData<Boolean> result) {
        api.createLabel(request).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                boolean success = response.isSuccessful();
                result.postValue(success);
                if (success) {
                    fetchLabels(internalLabelLiveData); // רענון ל-Room אחרי יצירה בשרת
                }
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
                    List<Label> labels = response.body();
                    saveLabelsToLocal(labels);
                    labelsLiveData.postValue(labels);
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

    private void saveLabelsToLocal(List<Label> labels) {
        executor.execute(() -> {
            labelDao.insertAll(labels);
        });
    }

    public LiveData<List<Label>> getAllLabels() {
        return labelDao.getAll();
    }

    public void insert(Label label) {
        executor.execute(() -> labelDao.insert(label));
    }

    public void delete(Label label) {
        executor.execute(() -> labelDao.delete(label));
    }

    public void update(Label label) {
        executor.execute(() -> labelDao.update(label));
    }
}
