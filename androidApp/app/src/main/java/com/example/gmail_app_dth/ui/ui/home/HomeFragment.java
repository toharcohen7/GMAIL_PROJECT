package com.example.gmail_app_dth.ui.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.gmail_app_dth.adapters.EmailAdapter;
import com.example.gmail_app_dth.databinding.FragmentHomeBinding;
import com.example.gmail_app_dth.Email;

import java.util.Arrays;
import java.util.List;

public class HomeFragment extends Fragment {

    private FragmentHomeBinding binding;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        // Inflate the layout using ViewBinding
        binding = FragmentHomeBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        // Dummy email list for testing
        List<Email> emailList = Arrays.asList(
                new Email("1", "user123", "sent", "alice@gmail.com",
                        new String[]{"bob@gmail.com"}, "Meeting Update",
                        "Don't forget our meeting tomorrow.", "Inbox", "26/06/2025", true, true),

                new Email("2", "user456", "draft", "charlie@gmail.com",
                        new String[]{"dave@gmail.com"}, "Invoice",
                        "Here is the invoice for this month.", "Draft", "25/06/2025", false, false)
        );

        // Create and set adapter
        EmailAdapter adapter = new EmailAdapter(emailList, email -> {
            Toast.makeText(getContext(), "Star clicked: " + email.getSubject(), Toast.LENGTH_SHORT).show();
            // בעתיד: homeViewModel.toggleStarStatus(email.getId(), !email.isStarred());
        });

        RecyclerView recyclerView = binding.mailList;
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(adapter);

        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
