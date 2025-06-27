package com.example.gmail_app_dth;

public class Email {
    private String id;
    private String userId;
    private String mailStatus;
    private String senderId;
    private String[] receiversNames;
    private String subject;
    private String content;
    private String labelName;
    private String formattedTime;
    private boolean starred;
    private boolean onRead;

    // 🔧 Constructor
    public Email(String id, String userId, String mailStatus, String senderId,
                 String[] receiversNames, String subject, String content,
                 String labelName, String formattedTime, boolean starred, boolean onRead) {
        this.id = id;
        this.userId = userId;
        this.mailStatus = mailStatus;
        this.senderId = senderId;
        this.receiversNames = receiversNames;
        this.subject = subject;
        this.content = content;
        this.labelName = labelName;
        this.formattedTime = formattedTime;
        this.starred = starred;
        this.onRead = onRead;
    }

    // 🧾 Getters
    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getMailStatus() {
        return mailStatus;
    }

    public String getSenderId() {
        return senderId;
    }

    public String[] getReceiversNames() {
        return receiversNames;
    }

    public String getSubject() {
        return subject;
    }

    public String getContent() {
        return content;
    }

    public String getLabelName() {
        return labelName;
    }

    public String getFormattedTime() {
        return formattedTime;
    }

    public boolean isStarred() {
        return starred;
    }

    public boolean isOnRead() {
        return onRead;
    }

    // אם תצטרך גם Setters בעתיד - נוסיף
}
