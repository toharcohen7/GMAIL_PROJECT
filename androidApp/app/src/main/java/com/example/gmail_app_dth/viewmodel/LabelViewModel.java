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

    private final MutableLiveData<Boolean> labelEditResult = new MutableLiveData<>();
    private final MutableLiveData<Boolean> labelDeleteResult = new MutableLiveData<>();



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
    public LiveData<Boolean> getLabelEditResult() {
        return labelEditResult;
    }
    public LiveData<Boolean> getLabelDeleteResult() {
        return labelDeleteResult;
    }

    public void fetchLabels() {
        labelRepository.fetchLabels(new MutableLiveData<>());
    }

    public void createLabel(String labelName) {
        LabelRequest request = new LabelRequest(labelName, "default-icon");
        labelRepository.createLabel(request, labelCreationResult);
    }

    public void editLabel(String labelName, LabelRequest request) {
        labelRepository.editLabel(labelName, request, labelEditResult);
    }

    public void deleteLabel(String labelName) {
        labelRepository.deleteLabel(labelName, labelDeleteResult);
    }


}
