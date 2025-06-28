package com.example.gmail_app_dth;

public class Mail {
    private String id;
    private String mailStatus;
    private String labelName;
    private String senderId;
    private String[] receiversNames;
    private String subject;
    private String content;
    private boolean starred;
    private boolean onRead;
    private String time;

    // Getters
    public String getId() { return id; }
    public String getMailStatus() { return mailStatus; }
    public String getLabelName() { return labelName; }
    public String getSenderId() { return senderId; }
    public String[] getReceiversNames() { return receiversNames; }
    public String getSubject() { return subject; }
    public String getContent() { return content; }
    public boolean isStarred() { return starred; }
    public boolean isOnRead() { return onRead; }
    public String getTime() { return time; }


    public void setStarred(boolean starred) {
        this.starred = starred;
    }
}


