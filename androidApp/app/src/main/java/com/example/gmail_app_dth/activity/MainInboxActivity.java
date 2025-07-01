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
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
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
import com.example.gmail_app_dth.ImageUtils;
import com.example.gmail_app_dth.R;
import com.example.gmail_app_dth.UserCache;
import com.example.gmail_app_dth.adapters.MailAdapter;
import com.example.gmail_app_dth.databinding.ActivityMainInboxBinding;
import com.example.gmail_app_dth.entities.Label;
import com.example.gmail_app_dth.entities.Mail;
import com.example.gmail_app_dth.entities.User;
import com.example.gmail_app_dth.home.HomeFragment;
import com.example.gmail_app_dth.interfaces.UserDataCallback;
import com.example.gmail_app_dth.repository.UserRepository;
import com.example.gmail_app_dth.requests.LabelRequest;
import com.example.gmail_app_dth.viewmodel.LabelViewModel;
import com.example.gmail_app_dth.viewmodel.MailViewModel;
import com.google.android.material.navigation.NavigationView;
import com.google.android.material.snackbar.Snackbar;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
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
    private ImageView btnMarkRead, btnMarkUnread, btnSpam, btnTrash, btnMoveToLabel;
    private ImageView btnUnTrash, btnUnSpam;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SharedPreferences prefs = getSharedPreferences("settings", MODE_PRIVATE);
        boolean isDark = prefs.getBoolean("dark_mode", false);
        AppCompatDelegate.setDefaultNightMode(isDark ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO);

        super.onCreate(savedInstanceState);
        binding = ActivityMainInboxBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        setSupportActionBar(binding.appBarMainInbox.toolbar);

        binding.appBarMainInbox.fab.setOnClickListener(v -> showCreateMailDialog());

        labelViewModel = new ViewModelProvider(this).get(LabelViewModel.class);
        mailViewModel = new ViewModelProvider(this).get(MailViewModel.class);

        setupNavigationDrawer();
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

                    binding.navView.post(() -> {
                        View view = binding.navView.findViewById(item.getItemId());
                        if (view != null) {
                            view.setOnLongClickListener(v -> {
                                showLabelOptionsDialog(label);
                                return true;
                            });
                        }
                    });
                }
            }

            binding.navView.invalidate();
            String currentLabel = mailViewModel.getCurrentLabel();
            mailViewModel.fetchMailsByLabel(currentLabel);
            updateBulkActionButtonsVisibility(currentLabel);

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
        btnMarkRead = findViewById(R.id.btn_mark_read);
        btnMarkUnread = findViewById(R.id.btn_mark_unread);
        btnSpam = findViewById(R.id.btn_spam);
        btnTrash = findViewById(R.id.btn_trash);
        btnMoveToLabel = findViewById(R.id.btn_move_to_label);
        btnUnTrash = findViewById(R.id.btn_untrash);
        btnUnSpam = findViewById(R.id.btn_unspam);

        findViewById(R.id.btn_exit_selection).setOnClickListener(v -> clearSelectionFromFragment());

        btnMarkRead.setOnClickListener(v -> clearSelectionAndRun(mails -> mailViewModel.markAllAsRead(mails)));
        btnMarkUnread.setOnClickListener(v -> clearSelectionAndRun(mails -> mailViewModel.markAllAsUnread(mails)));
        btnSpam.setOnClickListener(v -> clearSelectionAndRun(mails -> mailViewModel.markAsSpam(mails)));

        btnTrash.setOnClickListener(v -> clearSelectionAndRun(mails -> {
            boolean allInTrash = mails.stream().allMatch(m -> "Trash".equals(m.getLabelName()));
            if (allInTrash) {
                mailViewModel.deleteMails(mails);
            } else {
                mailViewModel.moveToLabel(mails, "Trash");
            }
        }));

        btnMoveToLabel.setOnClickListener(v -> showMoveToLabelMenu());

        btnUnTrash.setOnClickListener(v -> clearSelectionAndRun(mails -> {
            for (Mail mail : mails) {
                mailViewModel.moveToLabel(Collections.singletonList(mail), mail.getMailStatus());
            }
        }));

        btnUnSpam.setOnClickListener(v -> clearSelectionAndRun(mails -> {
            for (Mail mail : mails) {
                mailViewModel.moveToLabel(Collections.singletonList(mail), mail.getMailStatus());
            }
        }));
    }

    private void updateBulkActionButtonsVisibility(String label) {
        btnMarkRead.setVisibility(View.GONE);
        btnMarkUnread.setVisibility(View.GONE);
        btnSpam.setVisibility(View.GONE);
        btnTrash.setVisibility(View.GONE);
        btnMoveToLabel.setVisibility(View.GONE);
        if (btnUnTrash != null) btnUnTrash.setVisibility(View.GONE);
        if (btnUnSpam != null) btnUnSpam.setVisibility(View.GONE);

        switch (label) {
            case "Sent":
            case "Draft":
                btnTrash.setVisibility(View.VISIBLE);
                break;
            case "Trash":
                btnTrash.setVisibility(View.VISIBLE);
                if (btnUnTrash != null) btnUnTrash.setVisibility(View.VISIBLE);
                break;
            case "Spam":
                btnTrash.setVisibility(View.VISIBLE);
                if (btnUnSpam != null) btnUnSpam.setVisibility(View.VISIBLE);
                break;
            default:
                btnMarkRead.setVisibility(View.VISIBLE);
                btnMarkUnread.setVisibility(View.VISIBLE);
                btnSpam.setVisibility(View.VISIBLE);
                btnTrash.setVisibility(View.VISIBLE);
                btnMoveToLabel.setVisibility(View.VISIBLE);
                break;
        }
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
                Bitmap bitmap = com.example.gmail_app_dth.ImageUtils.decodeBase64Image(imageBase64);
                if (bitmap != null) {
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
                }
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
            Bitmap decodedBitmap = ImageUtils.decodeBase64Image(image);
            Glide.with(this)
                    .load(decodedBitmap)
                    .circleCrop()
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
            updateBulkActionButtonsVisibility("Starred");
        } else {
            mailViewModel.setCurrentLabel(title);
            mailViewModel.fetchMailsByLabel(title);
            updateBulkActionButtonsVisibility(title);
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

        Set<String> alwaysBlocked = new HashSet<>(Arrays.asList("Draft", "Sent"));
        List<String> allowedStatuses = Arrays.asList("Sent", "Received", "Draft");

        for (Mail mail : selectedMails) {
            if (!allowedStatuses.contains(mail.getMailStatus())) {
                Snackbar.make(findViewById(android.R.id.content), "Unsupported mail status", Snackbar.LENGTH_SHORT).show();
                return;
            }
        }

        Set<String> blockedPerMail = new HashSet<>();
        for (Mail mail : selectedMails) {
            switch (mail.getMailStatus()) {
                case "Sent":
                    blockedPerMail.add("Spam");
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

        String currentLabel = mailViewModel.getCurrentLabel();
        blockedPerMail.add(currentLabel);


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
    private void showCreateMailDialog() {
        View dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_create_mail, null);
        EditText editReceivers = dialogView.findViewById(R.id.edit_receivers);
        EditText editSubject = dialogView.findViewById(R.id.edit_subject);
        EditText editContent = dialogView.findViewById(R.id.edit_content);

        mailViewModel.createMail(mailId -> {
            AlertDialog dialog = new AlertDialog.Builder(this)
                    .setTitle("New Mail")
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
                        Toast.makeText(this, "Recipient is required", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    mailViewModel.sendMail(mailId, to, subject, content);
                    dialog.dismiss();
                });


                dialog.getButton(AlertDialog.BUTTON_NEGATIVE).setOnClickListener(v -> {
                    String to = editReceivers.getText().toString().trim();
                    String subject = editSubject.getText().toString().trim();
                    String content = editContent.getText().toString().trim();

                    boolean isEmpty = to.isEmpty() && subject.isEmpty() && content.isEmpty();

                    if (isEmpty) {
                        mailViewModel.deleteMailsById(Collections.singletonList(mailId));
                    } else {
                        List<String> receivers = Arrays.asList(to.split("\\s*,\\s*"));
                        mailViewModel.updateMailAsDraft(mailId, subject, content, receivers);

                    }

                    dialog.dismiss();
                });
            });

            dialog.show();
        }, () -> {
            Toast.makeText(this, "Failed to create mail", Toast.LENGTH_SHORT).show();
        });
    }
    private void showLabelOptionsDialog(Label label) {
        String[] options = {"Edit", "Delete"};

        new AlertDialog.Builder(this)
                .setTitle("Label: " + label.getName())
                .setItems(options, (dialog, which) -> {
                    if (which == 0) {
                        showEditLabelDialog(label);
                    } else if (which == 1) {
                        deleteLabel(label);
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void showEditLabelDialog(Label label) {
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_add_label, null);
        EditText editLabelName = dialogView.findViewById(R.id.editLabelName);
        editLabelName.setText(label.getName());

        new AlertDialog.Builder(this)
                .setTitle("Edit Label")
                .setView(dialogView)
                .setPositiveButton("Save", (dialog, which) -> {
                    String newName = editLabelName.getText().toString().trim();
                    if (!newName.isEmpty()) {
                        LabelRequest request = new LabelRequest(newName, label.getIconClass());
                        labelViewModel.editLabel(label.getId(), request);
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }
    private void deleteLabel(Label label) {
        new AlertDialog.Builder(this)
                .setTitle("Delete Label")
                .setMessage("Are you sure you want to delete \"" + label.getName() + "\"?")
                .setPositiveButton("Delete", (dialog, which) -> {
                    labelViewModel.deleteLabel(label.getId());
                })
                .setNegativeButton("Cancel", null)
                .show();
    }


}

