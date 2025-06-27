package com.example.gmail_app_dth.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.gmail_app_dth.R;
import com.example.gmail_app_dth.Email;

import java.util.List;

public class EmailAdapter extends RecyclerView.Adapter<EmailAdapter.EmailViewHolder> {

    public interface OnStarClickListener {
        void onStarClicked(Email email);
    }


    private final List<Email> emailList;

    private OnStarClickListener starClickListener;

    public EmailAdapter(List<Email> emailList, OnStarClickListener listener) {
        this.emailList = emailList;
        this.starClickListener = listener;
    }


    @NonNull
    @Override
    public EmailViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.mail_item, parent, false);
        return new EmailViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(@NonNull EmailViewHolder holder, int position) {
        Email email = emailList.get(position);

        // קישור בין השדות במודל ל־mail_item.xml
        holder.sender.setText(email.getSenderId());
        holder.subject.setText(email.getSubject());
        holder.content.setText(email.getContent());
        holder.date.setText(email.getFormattedTime());

        // כוכב מסומן או ריק
        if (email.isStarred()) {
            holder.starButton.setImageResource(R.drawable.ic_full_star_foreground);
        } else {
            holder.starButton.setImageResource(R.drawable.ic_empty_star_foreground);
        }

        // אפשרות לשנות סטטוס כוכב בלחיצה
        holder.starButton.setOnClickListener(v -> {
            if (starClickListener != null) {
                starClickListener.onStarClicked(email);
            }
        });
            // כאן בעתיד תוכל גם לעדכן בשרת את השינוי
    }

    @Override
    public int getItemCount() {
        return emailList.size();
    }

    // ViewHolder פנימי שמחזיק את כל רכיבי התצוגה
    public static class EmailViewHolder extends RecyclerView.ViewHolder {
        TextView sender, subject, content, date;
        ImageButton starButton;
        ImageView imageIcon;

        public EmailViewHolder(@NonNull View itemView) {
            super(itemView);
            sender = itemView.findViewById(R.id.mail_title);
            subject = itemView.findViewById(R.id.mail_subject);
            content = itemView.findViewById(R.id.mail_content);
            date = itemView.findViewById(R.id.mail_date);
            starButton = itemView.findViewById(R.id.button);
            imageIcon = itemView.findViewById(R.id.imageView2);
        }
    }

}
