package com.example.gmail_app_dth.repository;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;

import com.example.gmail_app_dth.requests.SignInRequest;
import com.example.gmail_app_dth.interfaces.UserDataCallback;
import com.example.gmail_app_dth.requests.UserRegistrationRequest;
import com.example.gmail_app_dth.entities.User;
import com.example.gmail_app_dth.interfaces.WebServiceAPI;

import org.json.JSONObject;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UserRepository {

    private final WebServiceAPI webServiceAPI;

    public UserRepository() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://7d6d-79-181-175-112.ngrok-free.app/api/") // חשוב! "localhost" = המחשב שלך, ב־Emulator כותבים 10.0.2.2
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        webServiceAPI = retrofit.create(WebServiceAPI.class);
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
                                // אחרי התחברות מוצלחת → נשלוף את המשתמש
                                fetchUserData(token, context, new UserDataCallback() {
                                    @Override
                                    public void onSuccess(User user) {
                                        callback.onSuccess(token); // או אפשר לשלוח גם את ה־user אם תרצה
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

                    callback.onSuccess(user); // מעביר את המשתמש חזרה אם צריך
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
        webServiceAPI.getUserById(userId).enqueue(new Callback<User>() {
            @Override
            public void onResponse(@NonNull Call<User> call, @NonNull Response<User> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onSuccess(response.body());
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

}

