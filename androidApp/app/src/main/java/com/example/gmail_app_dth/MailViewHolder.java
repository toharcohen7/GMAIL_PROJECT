package com.example.gmail_app_dth;

import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.gmail_app_dth.R;

public class MailViewHolder extends RecyclerView.ViewHolder {
    public TextView sender, subject, content, date;
    public ImageButton starButton;
    public ImageView imageIcon;

    public MailViewHolder(@NonNull View itemView) {
        super(itemView);
        sender = itemView.findViewById(R.id.mail_title);
        subject = itemView.findViewById(R.id.mail_subject);
        content = itemView.findViewById(R.id.mail_content);
        date = itemView.findViewById(R.id.mail_date);
        starButton = itemView.findViewById(R.id.button);
        imageIcon = itemView.findViewById(R.id.imageView2);
    }
}
