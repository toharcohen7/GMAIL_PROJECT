package com.example.gmail_app_dth.repository;

import androidx.room.Database;
import androidx.room.RoomDatabase;

import com.example.gmail_app_dth.dao.LabelDao;
import com.example.gmail_app_dth.dao.MailDao;
import com.example.gmail_app_dth.dao.UserDao;
import com.example.gmail_app_dth.entities.User;
import com.example.gmail_app_dth.entities.Label;
import com.example.gmail_app_dth.entities.Mail;

@Database(entities = {User.class, Label.class, Mail.class}, version = 2)
public abstract class AppDatabase extends RoomDatabase {
    public abstract UserDao userDao();
    public abstract LabelDao labelDao();
    public abstract MailDao mailDao();
}
