package com.example.gmail_app_dth.ui.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.gmail_app_dth.Mail;
import com.example.gmail_app_dth.MainInboxViewModel;
import com.example.gmail_app_dth.R;
import com.example.gmail_app_dth.UserCache;
import com.example.gmail_app_dth.UserDataCallback;
import com.example.gmail_app_dth.UserRepository;
import com.example.gmail_app_dth.UserResponse;
import com.example.gmail_app_dth.adapters.MailAdapter;
import com.example.gmail_app_dth.databinding.FragmentHomeBinding;
import com.example.gmail_app_dth.MailInteractionListener;
import com.example.gmail_app_dth.MailViewHolder;

public class HomeFragment extends Fragment {

    private FragmentHomeBinding binding;
    private MainInboxViewModel viewModel;
    private MailAdapter mailAdapter;
    private final UserRepository userRepository = new UserRepository();

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        binding = FragmentHomeBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        viewModel = new ViewModelProvider(requireActivity()).get(MainInboxViewModel.class);

        // אתחול adapter עם listener מעודכן
        mailAdapter = new MailAdapter(requireContext(), new MailInteractionListener() {
            @Override
            public void onStarClicked(Mail mail) {
                viewModel.toggleStar(mail);
            }

            @Override
            public void onRequestSenderInfo(String senderId, MailViewHolder holder) {
                userRepository.getUserById(senderId, new UserDataCallback() {
                    @Override
                    public void onSuccess(UserResponse user) {
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
        });

        RecyclerView recyclerView = binding.mailList;
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(mailAdapter);

        viewModel.getMailsLiveData().observe(getViewLifecycleOwner(), mails -> {
            mailAdapter.setData(mails);
        });

        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
