package com.example.gmail_app_dth;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

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

    public MainInboxViewModel(@NonNull Application application) {
        super(application);

        SharedPreferences prefs = application.getSharedPreferences("auth", Context.MODE_PRIVATE);
        String userId = prefs.getString("userId", null);

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

}
