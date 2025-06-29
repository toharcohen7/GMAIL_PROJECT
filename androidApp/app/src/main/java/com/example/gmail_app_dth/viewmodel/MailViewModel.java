package com.example.gmail_app_dth.viewmodel;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.gmail_app_dth.repository.MailRepository;
import com.example.gmail_app_dth.entities.Mail;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MailViewModel extends AndroidViewModel {

    private final MailRepository mailRepository;
    private final MutableLiveData<List<Mail>> mailsLiveData = new MutableLiveData<>();
    private final MutableLiveData<String> toastMessage = new MutableLiveData<>();
    public LiveData<String> getToastMessage() { return toastMessage; }

    private String currentLabel = "Received";
    public void setCurrentLabel(String label) { currentLabel = label; }
    public String getCurrentLabel() { return currentLabel; }

    public MailViewModel(@NonNull Application application) {
        super(application);

        SharedPreferences prefs = application.getSharedPreferences("auth", Context.MODE_PRIVATE);
        String userId = prefs.getString("userId", null);

        if (userId == null || userId.isEmpty()) {
            Log.e("MAIL_VM", "⚠️ userId is null or empty – this will cause 401 Unauthorized");
        } else {
            Log.d("MAIL_VM", "✅ userId loaded: " + userId);
        }

        mailRepository = new MailRepository(userId);
    }

    public LiveData<List<Mail>> getMailsLiveData() {
        return mailsLiveData;
    }

    public void fetchMailsByLabel(String labelName) {
        mailRepository.fetchMailsByLabel(labelName, mailsLiveData);
    }

    public void toggleStar(Mail mail) {
        boolean newStatus = !mail.isStarred();

        mailRepository.updateStarStatus(mail.getId(), newStatus,
                () -> {
                    mail.setStarred(newStatus);
                    mailsLiveData.postValue(mailsLiveData.getValue());

                    toastMessage.postValue(newStatus ? "This mail is starred" : "Star removed from mail");
                },
                () -> toastMessage.postValue("Failed to update star status")
        );
    }

    public void markMailAsRead(Mail mail) {
        if (mail.isOnRead()) return;

        mailRepository.updateMailReadStatus(mail.getId(), true,
                () -> {
                    mail.setOnRead(true);
                    mailsLiveData.postValue(mailsLiveData.getValue());
                },
                () -> toastMessage.postValue("Failed to mark mail as read")
        );
    }

    public void searchMails(String query) {
        mailRepository.searchMails(query, new MutableLiveData<List<Mail>>() {
            @Override
            public void postValue(List<Mail> allResults) {
                List<Mail> filtered = new ArrayList<>();

                for (Mail mail : allResults) {
                    if (currentLabel.equals(mail.getLabelName()) ||
                            (currentLabel.equals("Starred") && mail.isStarred())) {
                        filtered.add(mail);
                    }
                }

                mailsLiveData.postValue(filtered);
            }
        });
    }

    public void markAllAsRead(List<Mail> mails) {
        for (Mail mail : mails) {
            if (!mail.isOnRead()) {
                mailRepository.updateMailReadStatus(mail.getId(), true,
                        () -> {
                            mail.setOnRead(true);
                            mailsLiveData.postValue(mailsLiveData.getValue());
                        },
                        () -> toastMessage.postValue("Failed to mark as read")
                );
            }
        }
    }

    public void markAllAsUnread(List<Mail> mails) {
        for (Mail mail : mails) {
            if (mail.isOnRead()) {
                mailRepository.updateMailReadStatus(mail.getId(), false,
                        () -> {
                            mail.setOnRead(false);
                            mailsLiveData.postValue(mailsLiveData.getValue());
                        },
                        () -> toastMessage.postValue("Failed to mark as unread")
                );
            }
        }
    }


        public void moveToLabel(List<Mail> mails, String labelName) {
            AtomicInteger counter = new AtomicInteger(mails.size());

            for (Mail mail : mails) {
                mailRepository.updateLabel(mail.getId(), labelName,
                        () -> {
                            if (counter.decrementAndGet() == 0) {
                                // סיימנו לעדכן את כולם – מרעננים
                                fetchMailsByLabel(currentLabel);
                            }
                        },
                        () -> {
                            toastMessage.postValue("Failed to move some mails");
                            if (counter.decrementAndGet() == 0) {
                                fetchMailsByLabel(currentLabel);
                            }
                        }
                );
            }
        }

    public void deleteMails(List<Mail> mails) {
        AtomicInteger counter = new AtomicInteger(mails.size());

        for (Mail mail : mails) {
            mailRepository.deleteMail(mail.getId(),
                    () -> {
                        if (counter.decrementAndGet() == 0) {
                            fetchMailsByLabel(currentLabel);
                            toastMessage.postValue("Deleted successfully");
                        }
                    },
                    () -> {
                        if (counter.decrementAndGet() == 0) {
                            fetchMailsByLabel(currentLabel);
                        }
                        toastMessage.postValue("Some deletions failed");
                    }
            );
        }
    }

    public void markAsSpam(List<Mail> mails) {
        AtomicInteger counter = new AtomicInteger(mails.size());

        for (Mail mail : mails) {
            List<String> links = extractLinks(mail.getContent());

            if (!links.isEmpty()) {
                for (String link : links) {
                    mailRepository.addUrlToBlacklist(link, () -> {}, () -> {});
                }
            }

            mailRepository.updateLabel(mail.getId(), "Spam",
                    () -> {
                        if (counter.decrementAndGet() == 0) {
                            fetchMailsByLabel(currentLabel);
                        }
                    },
                    () -> {
                        toastMessage.postValue("Failed to mark some as spam");
                        if (counter.decrementAndGet() == 0) {
                            fetchMailsByLabel(currentLabel);
                        }
                    }
            );
        }
    }

    private List<String> extractLinks(String content) {
        List<String> links = new ArrayList<>();
        if (content == null) return links;

        Pattern urlPattern = Pattern.compile(
                "(?:^|\\s)(?:(?:file:///?" +
                        "|(?:[a-zA-Z][a-zA-Z0-9+.-]*):\\/\\/)" +
                        "?(?:localhost" +
                        "|(?:\\d{1,3}\\.){3}\\d{1,3}" +
                        "|(?:[a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})" +
                        "(?::\\d+)?(?:\\/\\S)?" +
                        ")(?=\\s|$)",
                Pattern.CASE_INSENSITIVE
        );

        Matcher matcher = urlPattern.matcher(content);

        while (matcher.find()) {
            links.add(matcher.group(1));
        }

        return links;
    }


}
