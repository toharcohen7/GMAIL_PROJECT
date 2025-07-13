package com.example.gmail_app_dth.repository;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
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
                .baseUrl("http://${BuildConfig.NODE_HOST}:${BuildConfig.NODE_PORT}/api/")
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        api = retrofit.create(WebServiceAPI.class);

        AppDatabase db = LocalDatabase.getInstance(context);
        labelDao = db.labelDao();
        executor = Executors.newSingleThreadExecutor();
    }

    public void createLabel(LabelRequest request, MutableLiveData<Boolean> result) {
        api.createLabel(request).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                boolean success = response.isSuccessful();
                result.postValue(success);
                if (success) {
                    fetchLabels(internalLabelLiveData);
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                result.postValue(false);
            }
        });
    }

    public void fetchLabels(@Nullable MutableLiveData<List<Label>> labelsLiveData) {
        api.getLabels().enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Label>> call, @NonNull Response<List<Label>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Label> labels = response.body();
                    saveLabelsToLocal(labels);
                    if (labelsLiveData != null) {
                        labelsLiveData.postValue(labels);
                    }
                } else {
                    if (labelsLiveData != null) {
                        labelsLiveData.postValue(Collections.emptyList());
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Label>> call, @NonNull Throwable t) {
                if (labelsLiveData != null) {
                    labelsLiveData.postValue(Collections.emptyList());
                }
            }
        });
    }


    private void saveLabelsToLocal(List<Label> labels) {
        executor.execute(() -> labelDao.insertAll(labels));
    }
    public void editLabel(String labelName, LabelRequest request, MutableLiveData<Boolean> result) {
        Log.d("LABEL_REPO", "Calling editLabel. NAME: " + labelName + ", New Name: " + request.getName());

        api.updateLabel(labelName, request).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                Log.d("LABEL_REPO", "editLabel response code: " + response.code());

                boolean success = response.isSuccessful();

                if (result != null) {
                    result.postValue(success);
                }

                if (success) {
                    fetchLabels(null);
                } else {
                    Log.e("LABEL_REPO", "editLabel failed. Body: " + response.message());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Log.e("LABEL_REPO", "editLabel request failed: " + t.getMessage());

                if (result != null) {
                    result.postValue(false);
                }
            }
        });
    }

    public void deleteLabel(String labelName, MutableLiveData<Boolean> result) {
        Log.d("LABEL_REPO", "Calling deleteLabel. NAME: " + labelName);

        api.deleteLabel(labelName).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                Log.d("LABEL_REPO", "deleteLabel response code: " + response.code());

                boolean success = response.isSuccessful();
                if (result != null) {
                    result.postValue(success);
                }

                if (success) {
                    executor.execute(() -> labelDao.deleteByName(labelName));
                    fetchLabels(null);
                } else {
                    Log.e("LABEL_REPO", "deleteLabel failed. Body: " + response.message());
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                Log.e("LABEL_REPO", "deleteLabel request failed: " + t.getMessage());
                if (result != null) {
                    result.postValue(false);
                }
            }
        });
    }


    public LiveData<List<Label>> getAllLabels() {
        return labelDao.getAll();
    }

    public void update(Label label) {
        executor.execute(() -> labelDao.update(label));
    }
}
