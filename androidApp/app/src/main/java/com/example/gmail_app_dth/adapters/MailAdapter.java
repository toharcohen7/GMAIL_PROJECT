package com.example.gmail_app_dth.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.gmail_app_dth.Mail;
import com.example.gmail_app_dth.R;
import com.example.gmail_app_dth.UserCache;
import com.example.gmail_app_dth.UserResponse;
import com.example.gmail_app_dth.MailInteractionListener;
import com.example.gmail_app_dth.MailViewHolder;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class MailAdapter extends RecyclerView.Adapter<MailViewHolder> {

    private final Context context;
    private final List<Mail> mailList = new ArrayList<>();
    private final MailInteractionListener listener;

    public MailAdapter(Context context, MailInteractionListener listener) {
        this.context = context;
        this.listener = listener;
    }

    @NonNull
    @Override
    public MailViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.mail_item, parent, false);
        return new MailViewHolder(itemView);
    }

    public void setData(List<Mail> newList) {
        mailList.clear();
        mailList.addAll(newList);
        notifyDataSetChanged();
    }

    @Override
    public void onBindViewHolder(@NonNull MailViewHolder holder, int position) {
        Mail mail = mailList.get(position);

        // שם ותמונה
        String senderId = mail.getSenderId();
        UserResponse sender = UserCache.get(senderId);

        if (sender != null) {
            holder.sender.setText(sender.getUserName());
            Glide.with(context)
                    .load(sender.getImage())
                    .placeholder(R.drawable.dashed_circle)
                    .circleCrop()
                    .into(holder.imageIcon);
        } else {
            holder.sender.setText("Loading...");
            listener.onRequestSenderInfo(senderId, holder);
        }

        holder.subject.setText(mail.getSubject());
        holder.content.setText(mail.getContent());
        holder.date.setText(formatDateOrTime(mail.getTime()));

        holder.starButton.setImageResource(
                mail.isStarred() ? R.drawable.ic_full_star_smaller_foreground : R.drawable.ic_empty_star_foreground
        );

        holder.starButton.setOnClickListener(v -> {
            listener.onStarClicked(mail);
            mail.setStarred(!mail.isStarred());
            notifyItemChanged(holder.getAdapterPosition());
        });
    }

    @Override
    public int getItemCount() {
        return mailList.size();
    }
    SimpleDateFormat serverFormat = new SimpleDateFormat("MMM dd, yyyy, HH:mm", Locale.ENGLISH);
    SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm", Locale.getDefault());
    SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM", Locale.getDefault());

    private String formatDateOrTime(String rawTime) {
        try {
            Date mailDate = serverFormat.parse(rawTime);

            Calendar now = Calendar.getInstance();
            Calendar mailCal = Calendar.getInstance();
            mailCal.setTime(mailDate);

            boolean isToday =
                    now.get(Calendar.YEAR) == mailCal.get(Calendar.YEAR) &&
                            now.get(Calendar.DAY_OF_YEAR) == mailCal.get(Calendar.DAY_OF_YEAR);

            if (isToday) {
                return timeFormat.format(mailDate); // תציג שעה בלבד
            } else {
                return dateFormat.format(mailDate); // תציג תאריך בלי שנה
            }

        } catch (ParseException e) {
            return rawTime; // fallback במקרה של שגיאה
        }
    }


}
