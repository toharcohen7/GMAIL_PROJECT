package com.example.gmail_app_dth;

import java.util.List;

public interface MailsCallback {
    void onMailsLoaded(List<Mail> mails);
    void onError(String errorMessage);
}
