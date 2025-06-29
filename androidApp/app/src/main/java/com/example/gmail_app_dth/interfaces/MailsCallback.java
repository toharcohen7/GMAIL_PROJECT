package com.example.gmail_app_dth.interfaces;

import com.example.gmail_app_dth.entities.Mail;

import java.util.List;

public interface MailsCallback {
    void onMailsLoaded(List<Mail> mails);
    void onError(String errorMessage);
}
