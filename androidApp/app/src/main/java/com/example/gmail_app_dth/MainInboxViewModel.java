package com.example.gmail_app_dth;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import java.util.ArrayList;
import java.util.List;

public class MainInboxViewModel extends AndroidViewModel {

    private final LabelRepository labelRepository;
    private final MutableLiveData<Boolean> labelCreationResult = new MutableLiveData<>();

    private final MutableLiveData<List<Label>> labelsLiveData = new MutableLiveData<>();

    private final MailRepository mailRepository;
    private final MutableLiveData<List<Mail>> mailsLiveData = new MutableLiveData<>();

    private final MutableLiveData<String> toastMessage = new MutableLiveData<>();
    public LiveData<String> getToastMessage() {
        return toastMessage;
    }

    private String currentLabel = "Received"; // ברירת מחדל

    public void setCurrentLabel(String label) {
        currentLabel = label;
    }

    public String getCurrentLabel() {
        return currentLabel;
    }

    public MainInboxViewModel(@NonNull Application application) {
        super(application);

        SharedPreferences prefs = application.getSharedPreferences("auth", Context.MODE_PRIVATE);
        String userId = prefs.getString("userId", null);

        if (userId == null || userId.isEmpty()) {
            Log.e("MAIL_VM", "⚠️ userId is null or empty – this will cause 401 Unauthorized");
        } else {
            Log.d("MAIL_VM", "✅ userId loaded: " + userId);
        }

        labelRepository = new LabelRepository(application.getApplicationContext());

        mailRepository = new MailRepository(userId);

    }

    public LiveData<Boolean> getLabelCreationResult() {
        return labelCreationResult;
    }

    public void createLabel(String labelName) {
        LabelRequest request = new LabelRequest(labelName, "default-icon");
        labelRepository.createLabel(request, labelCreationResult);
    }

    public LiveData<List<Label>> getLabelsLiveData() {
        return labelsLiveData;
    }

    public void fetchLabels() {
        labelRepository.fetchLabels(labelsLiveData);
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

                    if (newStatus) {
                        toastMessage.postValue("This mail is starred");
                    } else {
                        toastMessage.postValue("Star removed from mail");
                    }
                },
                () -> {
                    toastMessage.postValue("Failed to update star status");
                });
    }
    public void searchMails(String query) {
        mailRepository.searchMails(query, new MutableLiveData<List<Mail>>() {
            @Override
            public void postValue(List<Mail> allResults) {
                List<Mail> filtered = new ArrayList<>();

                for (Mail mail : allResults) {
                    // תווית רגילה
                    if (currentLabel.equals(mail.getLabelName())) {
                        filtered.add(mail);
                    }

                    // טיפול מיוחד ב־Starred
                    if (currentLabel.equals("Starred") && mail.isStarred()) {
                        filtered.add(mail);
                    }
                }

                mailsLiveData.postValue(filtered);
            }
        });
    }






}
