package com.example.gmail_app_dth.adapters;

import android.content.Context;
import android.graphics.Bitmap;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.gmail_app_dth.R;
import com.example.gmail_app_dth.UserCache;
import com.example.gmail_app_dth.entities.Mail;
import com.example.gmail_app_dth.entities.User;
import com.example.gmail_app_dth.interfaces.MailInteractionListener;
import com.example.gmail_app_dth.MailViewHolder;
import com.example.gmail_app_dth.viewmodel.MailViewModel;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

public class MailAdapter extends RecyclerView.Adapter<MailViewHolder> {

    private final Context context;
    private final List<Mail> mailList = new ArrayList<>();
    private final MailInteractionListener listener;
    private final MailViewModel viewModel;

    private final Set<String> selectedMailIds = new HashSet<>();
    private boolean selectionMode = false;

    public MailAdapter(Context context, MailInteractionListener listener, MailViewModel viewModel) {
        this.context = context;
        this.listener = listener;
        this.viewModel = viewModel;
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

        View mailContainer = holder.itemView.findViewById(R.id.mail_container);

        if ("Draft".equals(mail.getLabelName())) {
            holder.completeButton.setVisibility(View.VISIBLE);
            holder.completeButton.setOnClickListener(v -> listener.onDraftComplete(mail));
        } else {
            holder.completeButton.setVisibility(View.GONE);
        }

        if (selectionMode && selectedMailIds.contains(mail.getId())) {
            mailContainer.setBackgroundColor(ContextCompat.getColor(context, R.color.selection_blue));
        } else {
            int bgColor = mail.isOnRead()
                    ? ContextCompat.getColor(context, R.color.mail_read_bg)
                    : ContextCompat.getColor(context, R.color.mail_unread_bg);
            mailContainer.setBackgroundColor(bgColor);
        }

        holder.itemView.setOnClickListener(v -> {
            if (selectionMode) {
                toggleSelection(mail.getId());
            } else if (!"Draft".equals(mail.getLabelName())) {
                listener.onMailClicked(mail);
            }
        });


        holder.itemView.setOnLongClickListener(v -> {
            if (!selectionMode) {
                selectionMode = true;
                selectedMailIds.add(mail.getId());
                notifyDataSetChanged();
                listener.onSelectionStarted();
            }
            return true;
        });

        String senderId = mail.getSenderId();
        String currentUserId = context.getSharedPreferences("auth", Context.MODE_PRIVATE)
                .getString("userId", null);

        if (senderId != null && senderId.equals(currentUserId)) {
            String base64Image = context.getSharedPreferences("auth", Context.MODE_PRIVATE)
                    .getString("image", null);

            Bitmap bitmap = com.example.gmail_app_dth.ImageUtils.decodeBase64Image(base64Image);

            if (bitmap != null) {
                Glide.with(context)
                        .load(bitmap)
                        .placeholder(R.drawable.ic_user_placeholder_foreground)
                        .circleCrop()
                        .into(holder.imageIcon);
            } else {
                holder.imageIcon.setImageResource(R.drawable.ic_user_placeholder_foreground);
            }

            holder.sender.setText(context.getSharedPreferences("auth", Context.MODE_PRIVATE)
                    .getString("userName", "You"));

        } else {
            User sender = UserCache.get(senderId);
            if (sender != null) {
                holder.sender.setText(sender.getUserName() != null ? sender.getUserName() : "Unknown");

                Bitmap bitmap = com.example.gmail_app_dth.ImageUtils.decodeBase64Image(sender.getImage());

                if (bitmap != null) {
                    Glide.with(context)
                            .load(bitmap)
                            .placeholder(R.drawable.ic_user_placeholder_foreground)
                            .circleCrop()
                            .into(holder.imageIcon);
                } else {
                    holder.imageIcon.setImageResource(R.drawable.ic_user_placeholder_foreground);
                }

            } else {
                holder.sender.setText("Unknown");
                listener.onRequestSenderInfo(senderId, holder);
                holder.imageIcon.setImageResource(R.drawable.ic_user_placeholder_foreground);
            }
        }


        holder.subject.setText(mail.getSubject() != null ? mail.getSubject() : "(no subject)");
        holder.content.setText(mail.getContent() != null ? mail.getContent() : "");
        holder.date.setText(mail.getTime() != null ? formatDateOrTime(mail.getTime()) : "");

        holder.starButton.setImageResource(
                mail.isStarred() ? R.drawable.ic_full_star_smaller_foreground : R.drawable.ic_empty_star_foreground
        );

        holder.starButton.setOnClickListener(v -> {
            listener.onStarClicked(mail);
            mail.setStarred(!mail.isStarred());
            notifyItemChanged(holder.getAdapterPosition());
        });
    }

    public void appendData(List<Mail> newMails) {
        Set<String> existingIds = new HashSet<>();
        for (Mail mail : mailList) {
            existingIds.add(mail.getId());
        }

        List<Mail> uniqueNewMails = new ArrayList<>();
        for (Mail mail : newMails) {
            if (!existingIds.contains(mail.getId())) {
                uniqueNewMails.add(mail);
            }
        }

        int start = mailList.size();
        mailList.addAll(uniqueNewMails);
        notifyItemRangeInserted(start, uniqueNewMails.size());
    }



    private void toggleSelection(String mailId) {
        if (selectedMailIds.contains(mailId)) {
            selectedMailIds.remove(mailId);
        } else {
            selectedMailIds.add(mailId);
        }

        if (selectedMailIds.isEmpty()) {
            selectionMode = false;
            listener.onSelectionCanceled();
        }

        notifyDataSetChanged();
    }

    public List<Mail> getSelectedMails() {
        List<Mail> selected = new ArrayList<>();
        for (Mail mail : mailList) {
            if (selectedMailIds.contains(mail.getId())) {
                selected.add(mail);
            }
        }
        return selected;
    }

    public void clearSelection() {
        selectedMailIds.clear();
        selectionMode = false;
        notifyDataSetChanged();
        listener.onSelectionCanceled();
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
                return timeFormat.format(mailDate);
            } else {
                return dateFormat.format(mailDate);
            }

        } catch (ParseException e) {
            return rawTime;
        }
    }
}
