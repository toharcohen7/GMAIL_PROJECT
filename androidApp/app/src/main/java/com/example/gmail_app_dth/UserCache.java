package com.example.gmail_app_dth;

import java.util.HashMap;
import java.util.Map;

public class UserCache {
    private static final Map<String, UserResponse> cache = new HashMap<>();

    public static boolean contains(String userId) {
        return cache.containsKey(userId);
    }

    public static UserResponse get(String userId) {
        return cache.get(userId);
    }

    public static void put(String userId, UserResponse user) {
        cache.put(userId, user);
    }
}
