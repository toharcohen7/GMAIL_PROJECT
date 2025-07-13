package com.example.gmail_app_dth.requests;

public class LabelRequest {
    private final String name;
    private final String iconClass; // unused, for server communication usage

    public LabelRequest(String name, String iconClass) {
        this.name = name;
        this.iconClass = iconClass;
    }

    public String getName() {
        return name;
    }

}

