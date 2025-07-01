package com.example.gmail_app_dth.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.text.HtmlCompat;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.bumptech.glide.Glide;
import com.example.gmail_app_dth.R;
import com.example.gmail_app_dth.UserCache;
import com.example.gmail_app_dth.adapters.MailAdapter;
import com.example.gmail_app_dth.entities.Mail;
import com.example.gmail_app_dth.entities.User;
import com.example.gmail_app_dth.interfaces.MailInteractionListener;
import com.example.gmail_app_dth.interfaces.UserDataCallback;
import com.example.gmail_app_dth.viewmodel.MailViewModel;
import com.example.gmail_app_dth.MailViewHolder;
import com.example.gmail_app_dth.databinding.FragmentHomeBinding;
import com.example.gmail_app_dth.repository.UserRepository;
import com.example.gmail_app_dth.activity.MainInboxActivity;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class HomeFragment extends Fragment {

    private FragmentHomeBinding binding;
    private MailViewModel viewModel;
    private MailAdapter mailAdapter;
    private UserRepository userRepository;


    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        binding = FragmentHomeBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        userRepository = new UserRepository(requireContext());
        viewModel = new ViewModelProvider(requireActivity()).get(MailViewModel.class);

        mailAdapter = new MailAdapter(requireContext(), new MailInteractionListener() {
            @Override
            public void onStarClicked(Mail mail) {
                viewModel.toggleStar(mail);
            }

            @Override
            public void onRequestSenderInfo(String senderId, MailViewHolder holder) {
                userRepository.getUserById(senderId, new UserDataCallback() {
                    @Override
                    public void onSuccess(User user) {
                        UserCache.put(senderId, user);
                        holder.sender.setText(user.getUserName());
                        Glide.with(requireContext())
                                .load(user.getImage())
                                .placeholder(R.drawable.dashed_circle)
                                .circleCrop()
                                .into(holder.imageIcon);
                    }

                    @Override
                    public void onError(String errorMessage) {
                        holder.sender.setText("Unknown");
                    }
                });
            }

            @Override
            public void onMailClicked(Mail mail) {
                showMailPreviewDialog(mail);
                viewModel.markMailAsRead(mail);
            }

            @Override
            public void onSelectionStarted() {
                ((MainInboxActivity) requireActivity()).showBulkActionBar();
            }

            @Override
            public void onSelectionCanceled() {
                ((MainInboxActivity) requireActivity()).hideBulkActionBar();
            }

            @Override
            public void onDraftComplete(Mail mail) {
                showCompleteDraftDialog(mail);
            }

        }, viewModel);

        SwipeRefreshLayout swipeRefresh = binding.swipeRefresh;
        swipeRefresh.setOnRefreshListener(() -> {
            String currentLabel = viewModel.getCurrentLabel();
            viewModel.resetOffset(); // אפס את offset!
            viewModel.fetchMailsByLabel(currentLabel);
        });

        RecyclerView recyclerView = binding.mailList;
        LinearLayoutManager layoutManager = new LinearLayoutManager(getContext());
        recyclerView.setLayoutManager(layoutManager);
        recyclerView.setAdapter(mailAdapter);

        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);

                int visibleItemCount = layoutManager.getChildCount();
                int totalItemCount = layoutManager.getItemCount();
                int firstVisibleItemPosition = layoutManager.findFirstVisibleItemPosition();

                if ((visibleItemCount + firstVisibleItemPosition) >= totalItemCount
                        && firstVisibleItemPosition >= 0) {
                    String label = viewModel.getCurrentLabel();
                    viewModel.loadMoreMails(label, moreMails -> {
                        if (!moreMails.isEmpty()) {
                            mailAdapter.appendData(moreMails);
                        }
                    });
                }
            }
        });

        viewModel.getMailsLiveData().observe(getViewLifecycleOwner(), mails -> {
            mailAdapter.setData(mails);
            binding.swipeRefresh.setRefreshing(false);
        });

        return root;
    }


    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel.fetchMailsByLabel(viewModel.getCurrentLabel());
    }


    private void showMailPreviewDialog(Mail mail) {
        View dialogView = LayoutInflater.from(requireContext()).inflate(R.layout.dialog_mail_preview, null);

        TextView subjectView = dialogView.findViewById(R.id.dialog_mail_subject);
        TextView fromView = dialogView.findViewById(R.id.dialog_mail_sender);
        TextView dateView = dialogView.findViewById(R.id.dialog_mail_date);
        TextView contentView = dialogView.findViewById(R.id.dialog_mail_content);

        subjectView.setText(mail.getSubject());

        User sender = UserCache.get(mail.getSenderId());
        if (sender != null) {
            String fullName = sender.getFirstName() + " " + sender.getLastName();
            fromView.setText(HtmlCompat.fromHtml("<b>From:</b> " + fullName + " &lt;" + sender.getUserName() + "&gt;", HtmlCompat.FROM_HTML_MODE_LEGACY));
        } else {
            fromView.setText(HtmlCompat.fromHtml("<b>From:</b> Unknown", HtmlCompat.FROM_HTML_MODE_LEGACY));
        }

        dateView.setText(formatFullDate(mail.getTime()));
        contentView.setText(mail.getContent());

        new androidx.appcompat.app.AlertDialog.Builder(requireContext())
                .setView(dialogView)
                .setPositiveButton("Close", null)
                .show();
    }

    private String formatFullDate(String rawTime) {
        try {
            SimpleDateFormat inputFormat = new SimpleDateFormat("MMM dd, yyyy, HH:mm", Locale.ENGLISH);
            SimpleDateFormat outputFormat = new SimpleDateFormat("d.M.yyyy, HH:mm:ss", Locale.getDefault());
            Date date = inputFormat.parse(rawTime);
            return outputFormat.format(date);
        } catch (ParseException e) {
            return rawTime;
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
    private void showCompleteDraftDialog(Mail mail) {
        View dialogView = LayoutInflater.from(requireContext()).inflate(R.layout.dialog_create_mail, null);

        EditText editReceivers = dialogView.findViewById(R.id.edit_receivers);
        EditText editSubject = dialogView.findViewById(R.id.edit_subject);
        EditText editContent = dialogView.findViewById(R.id.edit_content);

        editReceivers.setText(String.join(", ", mail.getReceiversNames()));
        editSubject.setText(mail.getSubject());
        editContent.setText(mail.getContent());

        AlertDialog dialog = new AlertDialog.Builder(requireContext())
                .setTitle("Complete Draft")
                .setView(dialogView)
                .setPositiveButton("Send", null)
                .setNegativeButton("Cancel", null)
                .create();

        dialog.setOnShowListener(dlg -> {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(v -> {
                String to = editReceivers.getText().toString().trim();
                String subject = editSubject.getText().toString().trim();
                String content = editContent.getText().toString().trim();

                if (to.isEmpty()) {
                    Toast.makeText(requireContext(), "Recipient is required", Toast.LENGTH_SHORT).show();
                    return;
                }

                viewModel.sendMail(mail.getId(), to, subject, content);
                dialog.dismiss();
            });
        });

        dialog.show();
    }


}
