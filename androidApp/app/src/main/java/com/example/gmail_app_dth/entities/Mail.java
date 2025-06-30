package com.example.gmail_app_dth.entities;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.google.gson.annotations.SerializedName;

@Entity(tableName = "mails")
public class Mail {

    @PrimaryKey
    @NonNull
    @SerializedName("_id")
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

    @NonNull
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

    public void setId(@NonNull String id) { this.id = id; }
    public void setStarred(boolean starred) { this.starred = starred; }
    public void setOnRead(boolean onRead) { this.onRead = onRead; }
    public void setLabelName(String labelName) { this.labelName = labelName; }

    // ניתן להוסיף סטים נוספים בעת הצורך
}
