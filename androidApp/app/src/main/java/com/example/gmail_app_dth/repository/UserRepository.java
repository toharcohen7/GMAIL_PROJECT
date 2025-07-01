package com.example.gmail_app_dth.repository;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;

import com.example.gmail_app_dth.entities.User;
import com.example.gmail_app_dth.interfaces.UserDataCallback;
import com.example.gmail_app_dth.interfaces.WebServiceAPI;
import com.example.gmail_app_dth.requests.SignInRequest;
import com.example.gmail_app_dth.requests.UserRegistrationRequest;

import org.json.JSONObject;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UserRepository {

    private final WebServiceAPI webServiceAPI;
    private final com.example.gmail_app_dth.dao.UserDao userDao;
    private final ExecutorService executor;

    public UserRepository(Context context) {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:12345/api/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        webServiceAPI = retrofit.create(WebServiceAPI.class);

        AppDatabase db = LocalDatabase.getInstance(context);
        userDao = db.userDao();
        executor = Executors.newSingleThreadExecutor();
    }

    public void register(UserRegistrationRequest request, RegistrationCallback callback) {
        Call<Void> call = webServiceAPI.registerUser(request);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    callback.onSuccess();
                } else {
                    try (ResponseBody errorBody = response.errorBody()) {
                        if (errorBody != null) {
                            String errorJson = errorBody.string();
                            JSONObject errorObj = new JSONObject(errorJson);
                            String errorMessage = errorObj.optString("error", "unknown error");
                            callback.onError(errorMessage);
                        } else {
                            callback.onError("Unknown server error.");
                        }
                    } catch (Exception e) {
                        callback.onError("An error occurred while processing the server response.");
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                callback.onError("Network error: " + t.getMessage());
            }
        });
    }

    public interface RegistrationCallback {
        void onSuccess();
        void onError(String errorMessage);
    }

    public void signIn(SignInRequest request, Context context, LoginCallback callback) {
        Call<ResponseBody> call = webServiceAPI.signIn(request);
        call.enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<ResponseBody> call, @NonNull Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    try (ResponseBody body = response.body()) {
                        if (body != null) {
                            String json = body.string();
                            JSONObject obj = new JSONObject(json);
                            String token = obj.optString("token", null);

                            if (token != null && !token.isEmpty()) {
                                fetchUserData(token, context, new UserDataCallback() {
                                    @Override
                                    public void onSuccess(User user) {
                                        insert(user); // שמירה מקומית ב-Room
                                        callback.onSuccess(token);
                                    }

                                    @Override
                                    public void onError(String errorMessage) {
                                        callback.onError(errorMessage);
                                    }
                                });
                            } else {
                                callback.onError("Missing token in response.");
                            }
                        } else {
                            callback.onError("Empty response from server.");
                        }
                    } catch (Exception e) {
                        Log.e("UserRepository", "Error parsing sign-in success response", e);
                        callback.onError("An error occurred while processing the server response.");
                    }
                } else {
                    try (ResponseBody errorBody = response.errorBody()) {
                        if (errorBody != null) {
                            String errorJson = errorBody.string();
                            JSONObject errorObj = new JSONObject(errorJson);
                            String errorMessage = errorObj.optString("error", "Unknown error");
                            callback.onError(errorMessage);
                        } else {
                            callback.onError("Unknown server error.");
                        }
                    } catch (Exception e) {
                        Log.e("UserRepository", "Error parsing error response", e);
                        callback.onError("An error occurred while processing the server response.");
                    }
                }
            }

            @Override
            public void onFailure(@NonNull Call<ResponseBody> call, @NonNull Throwable t) {
                callback.onError("Network error: " + t.getMessage());
            }
        });
    }

    public interface LoginCallback {
        void onSuccess(String token);
        void onError(String errorMessage);
    }

    public void fetchUserData(String token, Context context, UserDataCallback callback) {
        String authHeader = "Bearer " + token;

        webServiceAPI.getCurrentUser(authHeader).enqueue(new Callback<User>() {
            @Override
            public void onResponse(@NonNull Call<User> call, @NonNull Response<User> response) {
                if (response.isSuccessful() && response.body() != null) {
                    User user = response.body();

                    // שמירה ב־SharedPreferences
                    SharedPreferences prefs = context.getSharedPreferences("auth", Context.MODE_PRIVATE);
                    prefs.edit()
                            .putString("token", token)
                            .putString("userId", user.getId())
                            .putString("userName", user.getUserName())
                            .putString("firstName", user.getFirstName())
                            .putString("lastName", user.getLastName())
                            .putString("gender", user.getGender())
                            .putString("birthDate", user.getBirthDate())
                            .putString("image", user.getImage())
                            .apply();

                    insert(user); // שמירה מקומית
                    callback.onSuccess(user);
                } else {
                    callback.onError("Failed to fetch user data");
                }
            }

            @Override
            public void onFailure(@NonNull Call<User> call, @NonNull Throwable t) {
                callback.onError("Network error: " + t.getMessage());
            }
        });
    }

    public void getUserById(String userId, UserDataCallback callback) {
        executor.execute(() -> {
            User localUser = userDao.getById(userId);
            if (localUser != null) {
                callback.onSuccess(localUser);
            } else {
                webServiceAPI.getUserById(userId).enqueue(new Callback<User>() {
                    @Override
                    public void onResponse(@NonNull Call<User> call, @NonNull Response<User> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            User user = response.body();
                            insert(user); // שמירה מקומית
                            callback.onSuccess(user);
                        } else {
                            callback.onError("User not found");
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<User> call, @NonNull Throwable t) {
                        callback.onError("Network error: " + t.getMessage());
                    }
                });
            }
        });
    }

    private void insert(User user) {
        executor.execute(() -> userDao.insert(user));
    }
}
