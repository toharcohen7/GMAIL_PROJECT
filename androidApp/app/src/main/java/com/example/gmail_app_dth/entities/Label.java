package com.example.gmail_app_dth.entities;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.SerializedName;

@Entity(tableName = "labels")
public class Label {
    @SerializedName("_id")
    @PrimaryKey
    @NonNull
    private String id;

    private String name;
    private String iconClass;

    public Label(@NonNull String id, String name, String iconClass) {
        this.id = id;
        this.name = name;
        this.iconClass = iconClass;
    }

    @NonNull
    public String getId() {
        return id;
    }

    public void setId(@NonNull String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public String getIconClass() {
        return iconClass;
    }

    public void setName(String name) {
        this.name = name;
    }

}
