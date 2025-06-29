package com.example.gmail_app_dth.requests;

public class MailUpdateRequest {
    private final Boolean starred;
    private final Boolean onRead;
    private final String labelName;

    public MailUpdateRequest(Boolean starred, Boolean onRead, String labelName) {
        this.starred = starred;
        this.onRead = onRead;
        this.labelName = labelName;
    }

    public Boolean getStarred() {
        return starred;
    }

    public Boolean getOnRead() {
        return onRead;
    }

    public String getLabelName() {
        return labelName;
    }
}
