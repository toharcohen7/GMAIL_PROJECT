package com.example.gmail_app_dth;

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
import androidx.appcompat.widget.SearchView;

import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.bumptech.glide.Glide;
import com.example.gmail_app_dth.databinding.ActivityMainInboxBinding;
import com.google.android.material.navigation.NavigationView;
import com.google.android.material.snackbar.Snackbar;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

public class MainInboxActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private AppBarConfiguration mAppBarConfiguration;
    private ActivityMainInboxBinding binding;
    private MainInboxViewModel viewModel;
    private static final int MENU_GROUP_LABELS = 123;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // טוען את מצב הדארק מוד לפני יצירת ה־Activity
        SharedPreferences prefs = getSharedPreferences("settings", MODE_PRIVATE);
        boolean isDark = prefs.getBoolean("dark_mode", false);
        AppCompatDelegate.setDefaultNightMode(isDark ? AppCompatDelegate.MODE_NIGHT_YES : AppCompatDelegate.MODE_NIGHT_NO);

        super.onCreate(savedInstanceState);
        binding = ActivityMainInboxBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        setSupportActionBar(binding.appBarMainInbox.toolbar);

        viewModel = new ViewModelProvider(this).get(MainInboxViewModel.class);

        setupNavigationDrawer();
        setupFabButton();
        observeLabels();
        observeLabelCreation();

        viewModel.fetchLabels();
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
        viewModel.getLabelsLiveData().observe(this, labels -> {
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
            viewModel.fetchMailsByLabel("Received");
        });
    }

    private void observeLabelCreation() {
        viewModel.getLabelCreationResult().observe(this, success -> {
            if (success != null) {
                Snackbar.make(binding.getRoot(),
                        success ? "Label created successfully!" : "Failed to create label",
                        Snackbar.LENGTH_SHORT).show();
                if (success) viewModel.fetchLabels();
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_inbox, menu);

        // שורת חיפוש
        MenuItem searchItem = menu.findItem(R.id.action_search);
        SearchView searchView = (SearchView) searchItem.getActionView();

        searchView.setQueryHint("Search mails...");
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                return false; // לא צריך לשלוח – כבר פועל בזמן הקלדה
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                Log.d("SEARCH", "Text changed: " + newText);
                if (newText.isEmpty()) {
                    Log.d("SEARCH", "Query is empty - loading default mails");
                    viewModel.fetchMailsByLabel("Received");
                } else {
                    Log.d("SEARCH", "Searching: " + newText);
                    viewModel.searchMails(newText);
                }
                return true;
            }

        });

        // עדכון אייקון מצב כהה לפי המצב השמור
        SharedPreferences prefs = getSharedPreferences("settings", MODE_PRIVATE);
        boolean isDark = prefs.getBoolean("dark_mode", false);
        MenuItem darkModeItem = menu.findItem(R.id.action_toggle_dark_mode);
        if (darkModeItem != null) {
            darkModeItem.setIcon(isDark
                    ? R.drawable.ic_light_mode_foreground
                    : R.drawable.ic_dark_mode_foreground);
        }

        // הצגת תמונת משתמש
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
            viewModel.setCurrentLabel("Starred");
            viewModel.fetchMailsByLabel("Starred");
        } else {
            viewModel.setCurrentLabel(title);
            viewModel.fetchMailsByLabel(title);

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
                        viewModel.createLabel(labelName);
                    } else {
                        Snackbar.make(binding.getRoot(), "Label name cannot be empty", Snackbar.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }
}
