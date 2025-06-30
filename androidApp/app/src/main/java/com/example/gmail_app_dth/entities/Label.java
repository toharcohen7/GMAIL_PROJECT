package com.example.gmail_app_dth.entities;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity
public class Label {

    @PrimaryKey(autoGenerate = true)
    private String id;
    private String name;
    private String iconClass;

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getIconClass() {
        return iconClass;
    }
}
