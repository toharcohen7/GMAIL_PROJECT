package com.example.gmail_app_dth;

import com.example.gmail_app_dth.entities.User;

import java.util.HashMap;
import java.util.Map;

public class UserCache {
    private static final Map<String, User> cache = new HashMap<>();

    public static User get(String userId) {
        return cache.get(userId);
    }

    public static void put(String userId, User user) {
        cache.put(userId, user);
    }
}
