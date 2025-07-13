package com.example.gmail_app_dth.entities;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.annotation.NonNull;


import com.google.gson.annotations.SerializedName;

import java.util.List;

@Entity(tableName = "mails")
public class Mail {
    @SerializedName("_id")
    @PrimaryKey
    @NonNull
    private String id;

    private final String mailStatus;
    private final String senderId;
    private final List<String> receiversNames;
    private String subject;
    private String content;
    private boolean starred;
    private boolean onRead;
    private String labelName;
    private final String time;

    // Constructor
    public Mail(@NonNull String id, String mailStatus, String senderId, List<String> receiversNames,
                String subject, String content, boolean starred, boolean onRead,
                String labelName, String time) {
        this.id = id;
        this.mailStatus = mailStatus;
        this.senderId = senderId;
        this.receiversNames = receiversNames;
        this.subject = subject;
        this.content = content;
        this.starred = starred;
        this.onRead = onRead;
        this.labelName = labelName;
        this.time = time;
    }

    // Getters and setters
    @NonNull
    public String getId() {
        return id;
    }

    public void setId(@NonNull String id) {
        this.id = id;
    }

    public String getMailStatus() {
        return mailStatus;
    }

    public String getSenderId() {
        return senderId;
    }

    public List<String> getReceiversNames() {
        return receiversNames;
    }


    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isStarred() {
        return starred;
    }

    public void setStarred(boolean starred) {
        this.starred = starred;
    }

    public boolean isOnRead() {
        return onRead;
    }

    public void setOnRead(boolean onRead) {
        this.onRead = onRead;
    }

    public String getLabelName() {
        return labelName;
    }

    public void setLabelName(String labelName) {
        this.labelName = labelName;
    }

    public String getTime() {
        return time;
    }

}
