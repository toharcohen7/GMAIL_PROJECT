package com.example.gmail_app_dth;

import android.util.Log;

import androidx.annotation.NonNull;

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
                .baseUrl("https://3880-79-181-175-112.ngrok-free.app/") // חשוב! "localhost" = המחשב שלך, ב־Emulator כותבים 10.0.2.2
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

    public void signIn(SignInRequest request, LoginCallback callback) {
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
                            if (!token.isEmpty()) {
                                callback.onSuccess(token);
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



}
