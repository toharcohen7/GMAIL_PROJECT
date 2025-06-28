package com.example.gmail_app_dth;

import java.io.IOException;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {

    private final String userId;

    public AuthInterceptor(String userId) {
        this.userId = userId;
    }

    @Override
    public Response intercept(Chain chain) throws IOException {
        Request original = chain.request();

        Request newRequest = original.newBuilder()
                .header("user-id", userId) // ← זה בדיוק מה שהשרת שלך מחפש
                .build();

        return chain.proceed(newRequest);
    }
}
