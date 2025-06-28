package com.example.gmail_app_dth;


public interface MailInteractionListener {
    void onStarClicked(Mail mail);
    void onRequestSenderInfo(String senderId, MailViewHolder holder);
}
