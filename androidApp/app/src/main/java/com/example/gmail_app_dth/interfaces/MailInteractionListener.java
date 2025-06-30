package com.example.gmail_app_dth.interfaces;


import com.example.gmail_app_dth.MailViewHolder;
import com.example.gmail_app_dth.entities.Mail;

public interface MailInteractionListener {
    void onStarClicked(Mail mail);
    void onMailClicked(Mail mail);

    void onRequestSenderInfo(String senderId, MailViewHolder holder);

    void onSelectionStarted();
    void onSelectionCanceled();
    void onDraftComplete(Mail mail);
}
