package com.example.gmail_app_dth.requests;

public class LabelRequest {
    private String name;
    private String iconClass;

    public LabelRequest(String name, String iconClass) {
        this.name = name;
        this.iconClass = iconClass;
    }

    public String getName() {
        return name;
    }

    public String getIconClass() {
        return iconClass;
    }
}

