package com.example.gmail_app_dth.repository;

import android.content.Context;

import androidx.room.Room;

public class LocalDatabase {

    private static AppDatabase instance;

    public static AppDatabase getInstance(Context context) {
        if (instance == null) {
            instance = Room.databaseBuilder(
                    context.getApplicationContext(),
                    AppDatabase.class,
                    "gmail_app_db"
            ).fallbackToDestructiveMigration().build();
        }
        return instance;
    }
}
