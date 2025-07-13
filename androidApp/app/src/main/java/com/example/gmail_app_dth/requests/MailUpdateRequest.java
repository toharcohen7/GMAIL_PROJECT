package com.example.gmail_app_dth.requests;

import java.util.List;

public class MailUpdateRequest {
    private final Boolean starred; // unused, for server communication usage
    private final Boolean onRead; // unused, for server communication usage
    private final String labelName;
    private final String subject;
    private final String content;
    private final List<String> receiversNames; // unused, for server communication usage

    public MailUpdateRequest(Boolean starred, Boolean onRead, String labelName,String subject, String content, List<String> receiversNames) {
        this.starred = starred;
        this.onRead = onRead;
        this.labelName = labelName;
        this.subject = subject;
        this.content = content;
        this.receiversNames = receiversNames;
    }

    public String getLabelName() {
        return labelName;
    }
    public String getSubject() { return subject; }
    public String getContent() { return content; }

}
