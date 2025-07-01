package com.example.gmail_app_dth.dao;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;
import androidx.room.Update;
import androidx.room.Delete;

import com.example.gmail_app_dth.entities.Label;

import java.util.List;

@Dao
public interface LabelDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(Label label);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<Label> labels);

    @Update
    void update(Label label);

    @Delete
    void delete(Label label);

    @Query("SELECT * FROM labels WHERE id = :id")
    Label getById(String id);

    @Query("SELECT * FROM labels")
    LiveData<List<Label>> getAll();
}
