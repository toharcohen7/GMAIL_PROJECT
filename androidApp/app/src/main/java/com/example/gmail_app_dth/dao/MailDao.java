package com.example.gmail_app_dth.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;

import com.example.gmail_app_dth.entities.Mail;

import java.util.List;

@Dao
public interface MailDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(Mail mail);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<Mail> mails);

    @Update
    void update(Mail mail);

    @Delete
    void delete(Mail mail);

    @Query("SELECT * FROM mails WHERE id = :mailId")
    Mail getById(String mailId);

    @Query("SELECT * FROM mails ORDER BY time DESC")
    LiveData<List<Mail>> getAll();

    @Query("SELECT * FROM mails WHERE labelName = :labelName ORDER BY time DESC")
    LiveData<List<Mail>> getByLabel(String labelName);

    @Query("SELECT * FROM mails WHERE starred = 1 ORDER BY time DESC")
    LiveData<List<Mail>> getStarred();
}
