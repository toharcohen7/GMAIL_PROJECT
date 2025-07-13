package com.example.gmail_app_dth;

import androidx.annotation.NonNull;

import java.io.IOException;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {

    private final String userId;

    public AuthInterceptor(String userId) {
        this.userId = userId;
    }

    @NonNull
    @Override
    public Response intercept(Chain chain) throws IOException {
        Request original = chain.request();

        Request newRequest = original.newBuilder()
                .header("user-id", userId)
                .build();

        return chain.proceed(newRequest);
    }
}
