package com.example.gmail_app_dth.repository;

import androidx.room.TypeConverter;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Converters {

    @TypeConverter
    public static String fromList(List<String> list) {
        return list != null ? String.join(",", list) : "";
    }

    @TypeConverter
    public static List<String> toList(String data) {
        return data != null && !data.isEmpty() ? Arrays.asList(data.split(",")) : Collections.emptyList();
    }
}
