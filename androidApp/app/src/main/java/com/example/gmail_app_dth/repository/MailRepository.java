package com.example.gmail_app_dth.repository;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import com.example.gmail_app_dth.AuthInterceptor;
import com.example.gmail_app_dth.dao.MailDao;
import com.example.gmail_app_dth.entities.Mail;
import com.example.gmail_app_dth.entities.User;
import com.example.gmail_app_dth.interfaces.UserDataCallback;
import com.example.gmail_app_dth.interfaces.WebServiceAPI;
import com.example.gmail_app_dth.requests.MailUpdateRequest;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MailRepository {

    private final WebServiceAPI api;
    private final MailDao mailDao;
    private final ExecutorService executor;

    private final UserRepository userRepository;


    public MailRepository(String userId, Context context) {
        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(new AuthInterceptor(userId))
                .build();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://383e-79-181-175-112.ngrok-free.app/api/")
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        api = retrofit.create(WebServiceAPI.class);

        AppDatabase db = LocalDatabase.getInstance(context);
        mailDao = db.mailDao();
        executor = Executors.newSingleThreadExecutor();
        userRepository = new UserRepository(context);
    }

    public void fetchMailsByLabel(String labelName, @Nullable MutableLiveData<List<Mail>> liveData) {
        api.getMailsByLabel(labelName).enqueue(new Callback<List<Mail>>() {
            @Override
            public void onResponse(@NonNull Call<List<Mail>> call, @NonNull Response<List<Mail>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Mail> mails = response.body();
                    String finalLabelName = labelName;

                    executor.execute(() -> {
                        // מוודאים שלכל מייל מוגדר labelName לפני שמירה
                        for (Mail mail : mails) {
                            mail.setLabelName(finalLabelName);
                        }

                        // שומרים ל־Room
                        mailDao.insertAll(mails);

                        // 🔍 הדפסה ללוג: מה נשמר בפועל בטבלת Room
                        List<Mail> allMails = mailDao.getAllImmediate(); // ← פונקציה רגילה (לא LiveData)
                        for (Mail m : allMails) {
                            Log.d("MAIL_AFTER_INSERT", "mail: " + m.getId() + ", label=" + m.getLabelName());
                        }

                        // טוענים גם את השולח
                        for (Mail mail : mails) {
                            userRepository.getUserById(mail.getSenderId(), new UserDataCallback() {
                                @Override
                                public void onSuccess(User user) {}

                                @Override
                                public void onError(String errorMessage) {
                                    Log.w("MailRepo", "Failed to fetch sender user: " + errorMessage);
                                }
                            });
                        }
                    });

                    if (liveData != null) liveData.postValue(mails);
                } else {
                    if (liveData != null) liveData.postValue(Collections.emptyList());
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Mail>> call, @NonNull Throwable t) {
                if (liveData != null) liveData.postValue(Collections.emptyList());
            }
        });
    }





    public LiveData<List<Mail>> getAllMails() {
        return mailDao.getAll();
    }

    public LiveData<List<Mail>> getMailsByLabel(String labelName) {
        return mailDao.getByLabel(labelName);
    }

    public LiveData<List<Mail>> getStarredMails() {
        return mailDao.getStarred();
    }

    public void updateStarStatus(String mailId, boolean newStatus, Runnable onSuccess, Runnable onError) {
        MailUpdateRequest request = new MailUpdateRequest(newStatus, null, null,null,null,null);
        api.updateMails(mailId, request).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    executor.execute(() -> {
                        Mail mail = mailDao.getById(mailId);
                        if (mail != null) {
                            mail.setStarred(newStatus);
                            mailDao.update(mail);
                        }
                    });
                    onSuccess.run();
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }

    public void updateMailReadStatus(String mailId, boolean newStatus, Runnable onSuccess, Runnable onError) {
        MailUpdateRequest request = new MailUpdateRequest(null, newStatus, null,null,null,null);
        api.updateMails(mailId, request).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    executor.execute(() -> {
                        Mail mail = mailDao.getById(mailId);
                        if (mail != null) {
                            mail.setOnRead(newStatus);
                            mailDao.update(mail);
                        }
                    });
                    onSuccess.run();
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }

    public void updateLabel(String mailId, String labelName, Runnable onSuccess, Runnable onError) {
        MailUpdateRequest request = new MailUpdateRequest(null, null, labelName,null,null,null);
        api.updateMails(mailId, request).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    executor.execute(() -> {
                        Mail mail = mailDao.getById(mailId);
                        if (mail != null) {
                            mail.setLabelName(labelName);
                            mailDao.update(mail);
                        }
                    });
                    onSuccess.run();
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }

    public void deleteMail(String mailId, Runnable onSuccess, Runnable onError) {
        api.deleteMail(mailId).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    executor.execute(() -> {
                        Mail mail = mailDao.getById(mailId);
                        if (mail != null) {
                            mailDao.delete(mail);
                        }
                    });
                    onSuccess.run();
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }

    public void addUrlToBlacklist(String url, Runnable onSuccess, Runnable onError) {
        Map<String, String> body = new HashMap<>();
        body.put("url", url);

        api.addToBlacklist(body).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    onSuccess.run();
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }

    public void createMail(Consumer<String> onSuccess, Runnable onError) {
        api.createMail().enqueue(new Callback<Mail>() {
            @Override
            public void onResponse(@NonNull Call<Mail> call, @NonNull Response<Mail> response) {
                if (response.isSuccessful() && response.body() != null) {
                    onSuccess.accept(response.body().getId());
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Mail> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }

    public void updateMailAsDraft(String mailId, String subject, String content, List<String> receivers, Runnable onSuccess, Runnable onError) {
        MailUpdateRequest request = new MailUpdateRequest(
                null, null, null, subject, content, receivers
        );
        updateMail(mailId, request, onSuccess, onError);
    }

    public void sendMail(String mailId, String to, String subject, String content, Runnable onSuccess, Runnable onError) {
        List<String> receivers = Arrays.asList(to.split(","));
        MailUpdateRequest request = new MailUpdateRequest(
                null, null, "Sent", subject, content, receivers
        );
        updateMail(mailId, request, onSuccess, onError);
    }

    private void updateMail(String mailId, MailUpdateRequest request, Runnable onSuccess, Runnable onError) {
        api.updateMail(mailId, request).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
                if (response.isSuccessful()) {
                    onSuccess.run();
                } else {
                    onError.run();
                }
            }

            @Override
            public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {
                onError.run();
            }
        });
    }
    public void searchMails(String query, MutableLiveData<List<Mail>> liveData) {
        api.searchMails(query).enqueue(new Callback<List<Mail>>() {
            @Override
            public void onResponse(@NonNull Call<List<Mail>> call, @NonNull Response<List<Mail>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    liveData.postValue(response.body());
                } else {
                    liveData.postValue(Collections.emptyList());
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Mail>> call, @NonNull Throwable t) {
                liveData.postValue(Collections.emptyList());
            }
        });
    }

    public void fetchMailsByLabelWithOffset(String labelName, int offset, Consumer<List<Mail>> onSuccess) {
        api.getMailsByLabel(labelName, offset).enqueue(new Callback<List<Mail>>() {
            @Override
            public void onResponse(@NonNull Call<List<Mail>> call, @NonNull Response<List<Mail>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    onSuccess.accept(response.body());
                } else {
                    onSuccess.accept(Collections.emptyList());
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Mail>> call, @NonNull Throwable t) {
                onSuccess.accept(Collections.emptyList());
            }
        });
    }


}
