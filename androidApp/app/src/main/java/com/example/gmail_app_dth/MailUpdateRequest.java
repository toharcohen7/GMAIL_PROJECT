package com.example.gmail_app_dth;

public class MailUpdateRequest {
    private final Boolean starred;

    public MailUpdateRequest(Boolean starred) {
        this.starred = starred;
    }

    public Boolean getStarred() {
        return starred;
    }
}
