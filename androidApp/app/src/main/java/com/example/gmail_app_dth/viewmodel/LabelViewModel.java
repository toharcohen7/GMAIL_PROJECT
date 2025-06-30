package com.example.gmail_app_dth.viewmodel;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.gmail_app_dth.entities.Label;
import com.example.gmail_app_dth.repository.LabelRepository;
import com.example.gmail_app_dth.requests.LabelRequest;

import java.util.List;

public class LabelViewModel extends AndroidViewModel {

    private final LabelRepository labelRepository;
    private final MutableLiveData<Boolean> labelCreationResult = new MutableLiveData<>();
    private final LiveData<List<Label>> labelsLiveData;

    public LabelViewModel(@NonNull Application application) {
        super(application);
        labelRepository = new LabelRepository(application.getApplicationContext());
        labelsLiveData = labelRepository.getAllLabels();
    }

    public LiveData<List<Label>> getLabelsLiveData() {
        return labelsLiveData;
    }

    public LiveData<Boolean> getLabelCreationResult() {
        return labelCreationResult;
    }

    public void fetchLabels() {
        labelRepository.fetchLabels(new MutableLiveData<>()); // קריאה לשרת ורענון Room בלבד
    }

    public void createLabel(String labelName) {
        LabelRequest request = new LabelRequest(labelName, "default-icon");
        labelRepository.createLabel(request, labelCreationResult);
    }
}
