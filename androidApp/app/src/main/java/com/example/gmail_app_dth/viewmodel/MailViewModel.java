package com.example.gmail_app_dth.viewmodel;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.gmail_app_dth.entities.Mail;
import com.example.gmail_app_dth.repository.MailRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Consumer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MailViewModel extends AndroidViewModel {

    private final MailRepository mailRepository;
    private final MutableLiveData<String> toastMessage = new MutableLiveData<>();
    private final MutableLiveData<List<Mail>> mailsLiveData = new MutableLiveData<>();

    public LiveData<List<Mail>> getMailsLiveData() { return mailsLiveData; }

    private String currentLabel = "Received";
    public void setCurrentLabel(String label) { currentLabel = label; }
    public String getCurrentLabel() { return currentLabel; }

    private int currentOffset = 0;
    private boolean isLoading = false;

    public MailViewModel(@NonNull Application application) {
        super(application);

        SharedPreferences prefs = application.getSharedPreferences("auth", Context.MODE_PRIVATE);
        String userId = prefs.getString("userId", null);

        mailRepository = new MailRepository(userId, application.getApplicationContext());
    }

    public void fetchMailsByLabel(String labelName) {
        currentLabel = labelName;
        currentOffset = 0;
        isLoading = false;

        mailRepository.fetchMailsByLabel(labelName, new MutableLiveData<>() {
            @Override
            public void postValue(List<Mail> value) {
                mailsLiveData.postValue(value);
            }
        });
    }


    public void toggleStar(Mail mail) {
        boolean newStatus = !mail.isStarred();

        mailRepository.updateStarStatus(mail.getId(), newStatus,
                () -> toastMessage.postValue(newStatus ? "This mail is starred" : "Star removed from mail"),
                () -> toastMessage.postValue("Failed to update star status")
        );
    }

    public void markMailAsRead(Mail mail) {
        if (mail.isOnRead()) return;

        mailRepository.updateMailReadStatus(mail.getId(), true,
                () -> {
                    mail.setOnRead(true);
                    updateLiveDataMail(mail);
                    toastMessage.postValue("Marked as read");
                },
                () -> toastMessage.postValue("Failed to mark mail as read")
        );
    }



    public void searchMails(String query) {
        mailRepository.searchMails(query, new MutableLiveData<>() {
            @Override
            public void postValue(List<Mail> allResults) {
                List<Mail> filtered = new ArrayList<>();

                for (Mail mail : allResults) {
                    if (currentLabel.equals(mail.getLabelName()) ||
                            ("Starred".equals(currentLabel) && mail.isStarred())) {
                        filtered.add(mail);
                    }
                }
                mailsLiveData.postValue(filtered);
                toastMessage.postValue("Found " + filtered.size() + " result(s)");
            }
        });
    }

    public void markAllAsRead(List<Mail> mails) {
        List<Mail> changed = new ArrayList<>();
        AtomicInteger counter = new AtomicInteger(mails.size());

        for (Mail mail : mails) {
            if (!mail.isOnRead()) {
                mailRepository.updateMailReadStatus(mail.getId(), true,
                        () -> {
                            mail.setOnRead(true);
                            changed.add(mail);
                            if (counter.decrementAndGet() == 0) {
                                updateLiveDataMails(changed);
                                toastMessage.postValue("Marked as read");
                            }
                        },
                        () -> {
                            if (counter.decrementAndGet() == 0) {
                                updateLiveDataMails(changed);
                            }
                            toastMessage.postValue("Failed to mark some as read");
                        }
                );
            } else {
                counter.decrementAndGet();
            }
        }
    }


    public void markAllAsUnread(List<Mail> mails) {
        List<Mail> changed = new ArrayList<>();
        AtomicInteger counter = new AtomicInteger(mails.size());

        for (Mail mail : mails) {
            if (mail.isOnRead()) {
                mailRepository.updateMailReadStatus(mail.getId(), false,
                        () -> {
                            mail.setOnRead(false);
                            changed.add(mail);
                            if (counter.decrementAndGet() == 0) {
                                updateLiveDataMails(changed);
                                toastMessage.postValue("Marked as unread");
                            }
                        },
                        () -> {
                            if (counter.decrementAndGet() == 0) {
                                updateLiveDataMails(changed);
                            }
                            toastMessage.postValue("Failed to mark some as unread");
                        }
                );
            } else {
                counter.decrementAndGet();
            }
        }
    }


    public void moveToLabel(List<Mail> mails, String labelName) {
        AtomicInteger counter = new AtomicInteger(mails.size());

        for (Mail mail : mails) {
            mailRepository.updateLabel(mail.getId(), labelName,
                    () -> {
                        if (counter.decrementAndGet() == 0) {
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

    public void deleteMailsById(List<String> mailIds) {
        AtomicInteger counter = new AtomicInteger(mailIds.size());

        for (String mailId : mailIds) {
            mailRepository.deleteMail(mailId,
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
                // regex used by the blacklist
                "(?:^|\\s)((?:(?:file:///?)|(?:[a-zA-Z][a-zA-Z0-9+.-]*):\\/\\/)?(?:localhost|(?:\\d{1,3}\\.){3}\\d{1,3}|(?:[a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})(?::\\d+)?(?:\\/\\S*)?)",
                Pattern.CASE_INSENSITIVE
        );

        Matcher matcher = urlPattern.matcher(content);

        while (matcher.find()) {
            links.add(matcher.group().trim());
        }

        return links;
    }

    public void createMail(Consumer<String> onSuccess, Runnable onError) {
        mailRepository.createMail(onSuccess, onError);
    }

    public void updateMailAsDraft(String mailId, String subject, String content, List<String> receivers) {
        mailRepository.updateMailAsDraft(mailId, subject, content, receivers,
                () -> toastMessage.postValue("Draft saved"),
                () -> toastMessage.postValue("Failed to save draft"));
    }

    public void sendMail(String mailId, String to, String subject, String content) {
        mailRepository.sendMail(mailId, to, subject, content,
                () -> {
                    toastMessage.postValue("Mail sent");
                    fetchMailsByLabel(currentLabel);
                },
                () -> {
                    toastMessage.postValue("Failed to send mail");
                    fetchMailsByLabel(currentLabel);
                });
    }

    public void resetOffset() {
        currentOffset = 0;
    }

    public void loadMoreMails(String labelName, Consumer<List<Mail>> onSuccess) {
        if (isLoading) return;
        isLoading = true;

        mailRepository.fetchMailsByLabelWithOffset(labelName, currentOffset, newMails -> {
            isLoading = false;
            currentOffset += newMails.size();
            onSuccess.accept(newMails);
        });
    }

    private void updateLiveDataMail(Mail updatedMail) {
        List<Mail> currentList = mailsLiveData.getValue();
        if (currentList == null) return;

        for (int i = 0; i < currentList.size(); i++) {
            if (currentList.get(i).getId().equals(updatedMail.getId())) {
                currentList.set(i, updatedMail);
                mailsLiveData.postValue(currentList);
                break;
            }
        }
    }
    private void updateLiveDataMails(List<Mail> updatedMails) {
        List<Mail> currentList = mailsLiveData.getValue();
        if (currentList == null) return;

        for (Mail updated : updatedMails) {
            for (int i = 0; i < currentList.size(); i++) {
                if (currentList.get(i).getId().equals(updated.getId())) {
                    currentList.set(i, updated);
                    break;
                }
            }
        }
        mailsLiveData.postValue(currentList);
    }


}
