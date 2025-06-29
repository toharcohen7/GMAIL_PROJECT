package com.example.gmail_app_dth.activity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.appcompat.widget.SearchView;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.gmail_app_dth.R;
import com.example.gmail_app_dth.adapters.MailAdapter;
import com.example.gmail_app_dth.databinding.ActivityMainInboxBinding;
import com.example.gmail_app_dth.entities.Label;
import com.example.gmail_app_dth.entities.Mail;
import com.example.gmail_app_dth.home.HomeFragment;
import com.example.gmail_app_dth.viewmodel.LabelViewModel;
import com.example.gmail_app_dth.viewmodel.MailViewModel;
import com.google.android.material.navigation.NavigationView;
import com.google.android.material.snackbar.Snackbar;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.function.Consumer;

public class MainInboxActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private AppBarConfiguration mAppBarConfiguration;
    private ActivityMainInboxBinding binding;
    private MailViewModel mailViewModel;
    private LabelViewModel labelViewModel;

    private static final int MENU_GROUP_LABELS = 123;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SharedPreferences prefs = getSharedPreferences("settings", MODE_PRIVATE);
        boolean isDark = prefs.getBoolean("dark_mode", false);
        AppCompatDelegate.setDefaultNightMode(isDark ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO);

        super.onCreate(savedInstanceState);
        binding = ActivityMainInboxBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        setSupportActionBar(binding.appBarMainInbox.toolbar);

        labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);
        mailViewModel = new ViewModelProvider(this).get(MailViewModel.class);

        setupNavigationDrawer();
        setupFabButton();
        observeLabels();
        observeLabelCreation();
        setupBulkActionButtons();

        labelViewModel.fetchLabels();
    }

    private void setupNavigationDrawer() {
        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;

        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_home, R.id.nav_gallery, R.id.nav_slideshow)
                .setOpenableLayout(drawer)
                .build();

        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main_inbox);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);

        navigationView.setNavigationItemSelectedListener(this);
    }

    private void setupFabButton() {
        binding.appBarMainInbox.fab.setOnClickListener(view ->
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null)
                        .setAnchorView(R.id.fab).show()
        );
    }

    private void observeLabels() {
        labelViewModel.getLabelsLiveData().observe(this, labels -> {
            Set<String> systemLabels = new HashSet<>(Arrays.asList("Draft", "Sent", "Received", "Spam", "Trash"));
            Menu menu = binding.navView.getMenu();
            menu.removeGroup(MENU_GROUP_LABELS);

            for (Label label : labels) {
                if (!systemLabels.contains(label.getName())) {
                    MenuItem item = menu.add(MENU_GROUP_LABELS, Menu.NONE, Menu.NONE, label.getName());
                    item.setCheckable(true);
                    item.setIcon(R.drawable.ic_user_label_foreground);
                }
            }

            binding.navView.invalidate();
            mailViewModel.fetchMailsByLabel("Received");
        });
    }

    private void observeLabelCreation() {
        labelViewModel.getLabelCreationResult().observe(this, success -> {
            if (success != null) {
                Snackbar.make(binding.getRoot(),
                        success ? "Label created successfully!" : "Failed to create label",
                        Snackbar.LENGTH_SHORT).show();
                if (success) labelViewModel.fetchLabels();
            }
        });
    }

    private void setupBulkActionButtons() {
        findViewById(R.id.btn_exit_selection).setOnClickListener(v -> {
            clearSelectionFromFragment();
        });

        findViewById(R.id.btn_mark_read).setOnClickListener(v -> {
            clearSelectionAndRun(mails -> mailViewModel.markAllAsRead(mails));
        });

        findViewById(R.id.btn_mark_unread).setOnClickListener(v -> {
            clearSelectionAndRun(mails -> mailViewModel.markAllAsUnread(mails));
        });

        findViewById(R.id.btn_spam).setOnClickListener(v -> {
            clearSelectionAndRun(mails -> mailViewModel.markAsSpam(mails));
        });


        findViewById(R.id.btn_trash).setOnClickListener(v -> {
            clearSelectionAndRun(mails -> {
                boolean allInTrash = mails.stream().allMatch(m -> "Trash".equals(m.getLabelName()));
                if (allInTrash) {
                    mailViewModel.deleteMails(mails); // 🗑 מחיקה סופית
                } else {
                    mailViewModel.moveToLabel(mails, "Trash"); // 📥 העברה לטראש
                }
            });
        });

        findViewById(R.id.btn_move_to_label).setOnClickListener(v -> {
            showMoveToLabelMenu();
        });

    }

    private void clearSelectionFromFragment() {
        HomeFragment fragment = (HomeFragment) getSupportFragmentManager()
                .findFragmentById(R.id.nav_host_fragment_content_main_inbox)
                .getChildFragmentManager()
                .getFragments()
                .get(0);

        if (fragment != null && fragment.getView() != null) {
            RecyclerView recyclerView = fragment.getView().findViewById(R.id.mail_list);
            RecyclerView.Adapter adapter = recyclerView.getAdapter();

            if (adapter instanceof MailAdapter) {
                ((MailAdapter) adapter).clearSelection();
            }
        }
    }

    private void clearSelectionAndRun(Consumer<List<Mail>> action) {
        HomeFragment fragment = (HomeFragment) getSupportFragmentManager()
                .findFragmentById(R.id.nav_host_fragment_content_main_inbox)
                .getChildFragmentManager()
                .getFragments()
                .get(0);

        if (fragment != null && fragment.getView() != null) {
            RecyclerView recyclerView = fragment.getView().findViewById(R.id.mail_list);
            RecyclerView.Adapter adapter = recyclerView.getAdapter();

            if (adapter instanceof MailAdapter) {
                List<Mail> selected = ((MailAdapter) adapter).getSelectedMails();
                action.accept(selected);
                ((MailAdapter) adapter).clearSelection();
            }
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_inbox, menu);

        MenuItem searchItem = menu.findItem(R.id.action_search);
        SearchView searchView = (SearchView) searchItem.getActionView();

        searchView.setQueryHint("Search mails...");
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                Log.d("SEARCH", "Text changed: " + newText);
                if (newText.isEmpty()) {
                    Log.d("SEARCH", "Query is empty - loading default mails");
                    mailViewModel.fetchMailsByLabel("Received");
                } else {
                    Log.d("SEARCH", "Searching: " + newText);
                    mailViewModel.searchMails(newText);
                }
                return true;
            }
        });

        SharedPreferences prefs = getSharedPreferences("settings", MODE_PRIVATE);
        boolean isDark = prefs.getBoolean("dark_mode", false);
        MenuItem darkModeItem = menu.findItem(R.id.action_toggle_dark_mode);
        if (darkModeItem != null) {
            darkModeItem.setIcon(isDark
                    ? R.drawable.ic_light_mode_foreground
                    : R.drawable.ic_dark_mode_foreground);
        }

        String imageBase64 = getSharedPreferences("auth", MODE_PRIVATE)
                .getString("image", null);
        if (imageBase64 != null) {
            try {
                byte[] imageBytes = android.util.Base64.decode(imageBase64, android.util.Base64.DEFAULT);
                Bitmap bitmap = android.graphics.BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);

                MenuItem item = menu.findItem(R.id.action_user_info);
                ImageView imageView = new ImageView(this);
                int size = (int) getResources().getDimension(R.dimen.action_bar_icon_size);
                imageView.setLayoutParams(new ViewGroup.LayoutParams(size, size));

                Glide.with(this)
                        .load(bitmap)
                        .placeholder(R.drawable.ic_user_placeholder_foreground)
                        .circleCrop()
                        .into(imageView);

                item.setActionView(imageView);
                imageView.setOnClickListener(v -> showUserInfoDialog());

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int itemId = item.getItemId();

        if (itemId == R.id.action_user_info) {
            showUserInfoDialog();
            return true;

        } else if (itemId == R.id.action_toggle_dark_mode) {
            toggleDarkMode();
            return true;

        } else if (itemId == R.id.action_sign_out) {
            signOutUser();
            return true;

        } else {
            return super.onOptionsItemSelected(item);
        }
    }

    private void toggleDarkMode() {
        SharedPreferences prefs = getSharedPreferences("settings", MODE_PRIVATE);
        boolean isDark = prefs.getBoolean("dark_mode", false);

        prefs.edit().putBoolean("dark_mode", !isDark).apply();
        AppCompatDelegate.setDefaultNightMode(!isDark ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO);
    }

    private void signOutUser() {
        SharedPreferences prefs = getSharedPreferences("app_prefs", MODE_PRIVATE);
        prefs.edit().clear().apply();

        Intent intent = new Intent(this, SignInActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }

    private void showUserInfoDialog() {
        SharedPreferences prefs = getSharedPreferences("auth", MODE_PRIVATE);
        String userName = prefs.getString("userName", "Unknown");
        String firstName = prefs.getString("firstName", "");
        String lastName = prefs.getString("lastName", "");
        String gender = prefs.getString("gender", "");
        String birthDate = prefs.getString("birthDate", "");
        String image = prefs.getString("image", "");

        View dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_user_info, null);

        ((TextView) dialogView.findViewById(R.id.user_name)).setText(userName);
        ((TextView) dialogView.findViewById(R.id.full_name)).setText(firstName + " " + lastName);
        ((TextView) dialogView.findViewById(R.id.gender)).setText(gender);

        try {
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
            SimpleDateFormat outputFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
            Date birth = inputFormat.parse(birthDate);
            ((TextView) dialogView.findViewById(R.id.birth_date)).setText(outputFormat.format(birth));
        } catch (ParseException e) {
            ((TextView) dialogView.findViewById(R.id.birth_date)).setText(birthDate);
        }

        try {
            byte[] imageBytes = android.util.Base64.decode(image, android.util.Base64.DEFAULT);
            Bitmap decodedBitmap = android.graphics.BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
            Glide.with(this).load(decodedBitmap).circleCrop()
                    .placeholder(R.drawable.ic_user_placeholder_foreground)
                    .into((ImageView) dialogView.findViewById(R.id.user_image));
        } catch (Exception e) {
            ((ImageView) dialogView.findViewById(R.id.user_image)).setImageResource(R.drawable.ic_user_placeholder_foreground);
        }

        new androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle("Your Profile")
                .setView(dialogView)
                .setPositiveButton("Close", null)
                .show();
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main_inbox);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();
        String title = item.getTitle().toString();

        if (id == R.id.nav_labels_header) {
            showAddLabelDialog();
        } else if (id == R.id.nav_stared) {
            mailViewModel.setCurrentLabel("Starred");
            mailViewModel.fetchMailsByLabel("Starred");
        } else {
            mailViewModel.setCurrentLabel(title);
            mailViewModel.fetchMailsByLabel(title);
        }

        binding.drawerLayout.closeDrawers();
        return true;
    }

    private void showAddLabelDialog() {
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_add_label, null);
        EditText editLabelName = dialogView.findViewById(R.id.editLabelName);

        new androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle("Add New Label")
                .setView(dialogView)
                .setPositiveButton("Add", (dialog, which) -> {
                    String labelName = editLabelName.getText().toString().trim();
                    if (!labelName.isEmpty()) {
                        labelViewModel.createLabel(labelName);
                    } else {
                        Snackbar.make(binding.getRoot(), "Label name cannot be empty", Snackbar.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    public void showBulkActionBar() {
        findViewById(R.id.toolbar).setVisibility(View.GONE);
        findViewById(R.id.bulk_action_bar).setVisibility(View.VISIBLE);
    }

    public void hideBulkActionBar() {
        findViewById(R.id.bulk_action_bar).setVisibility(View.GONE);
        findViewById(R.id.toolbar).setVisibility(View.VISIBLE);
    }
    private void showMoveToLabelMenu() {
        List<Mail> selectedMails = getSelectedMailsFromFragment();
        if (selectedMails.isEmpty()) return;

        // שלב 1: הגבלות בסיסיות
        Set<String> alwaysBlocked = new HashSet<>(Arrays.asList("Draft", "Sent"));
        List<String> allowedStatuses = Arrays.asList("Sent", "Received", "Draft");

        // שלב 2: בדיקת תקינות mailStatus
        for (Mail mail : selectedMails) {
            if (!allowedStatuses.contains(mail.getMailStatus())) {
                Snackbar.make(findViewById(android.R.id.content), "Unsupported mail status", Snackbar.LENGTH_SHORT).show();
                return;
            }
        }

        // שלב 3: חסימות לפי mailStatus
        Set<String> blockedPerMail = new HashSet<>();
        for (Mail mail : selectedMails) {
            switch (mail.getMailStatus()) {
                case "Sent":
                    blockedPerMail.add("Spam"); // אי אפשר לספאם מיילים שנשלחו
                    break;
                case "Received":
                    blockedPerMail.add("Sent");
                    blockedPerMail.add("Draft");
                    break;
                case "Draft":
                    blockedPerMail.add("Sent");
                    break;
            }
        }

        // שלב 4: תווית נוכחית – גם אותה לא ניתן לבחור
        String currentLabel = mailViewModel.getCurrentLabel();
        blockedPerMail.add(currentLabel); // מונע העברה חזרה לעצמך

        // שלב 5: סינון התוויות
        List<Label> allLabels = labelViewModel.getLabelsLiveData().getValue();
        if (allLabels == null) return;

        Set<String> blockSet = new HashSet<>(alwaysBlocked);
        blockSet.addAll(blockedPerMail);

        List<Label> filtered = new ArrayList<>();
        for (Label label : allLabels) {
            if (!blockSet.contains(label.getName())) {
                filtered.add(label);
            }
        }

        if (filtered.isEmpty()) {
            Snackbar.make(findViewById(android.R.id.content), "No valid labels to move to", Snackbar.LENGTH_SHORT).show();
            return;
        }

        String[] labelNames = new String[filtered.size()];
        for (int i = 0; i < filtered.size(); i++) {
            labelNames[i] = filtered.get(i).getName();
        }

        new androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle("Move to label")
                .setItems(labelNames, (dialog, which) -> {
                    String selectedLabel = labelNames[which];
                    clearSelectionAndRun(mails -> mailViewModel.moveToLabel(mails, selectedLabel));
                })
                .setNegativeButton("Cancel", null)
                .show();
    }


    private List<Mail> getSelectedMailsFromFragment() {
        HomeFragment fragment = (HomeFragment) getSupportFragmentManager()
                .findFragmentById(R.id.nav_host_fragment_content_main_inbox)
                .getChildFragmentManager()
                .getFragments()
                .get(0);

        if (fragment != null && fragment.getView() != null) {
            RecyclerView recyclerView = fragment.getView().findViewById(R.id.mail_list);
            RecyclerView.Adapter adapter = recyclerView.getAdapter();

            if (adapter instanceof MailAdapter) {
                return ((MailAdapter) adapter).getSelectedMails();
            }
        }

        return new ArrayList<>();
    }



}

