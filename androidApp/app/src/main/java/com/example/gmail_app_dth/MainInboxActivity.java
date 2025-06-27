package com.example.gmail_app_dth;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.example.gmail_app_dth.databinding.ActivityMainInboxBinding;
import com.google.android.material.navigation.NavigationView;
import com.google.android.material.snackbar.Snackbar;

public class MainInboxActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private AppBarConfiguration mAppBarConfiguration;
    private ActivityMainInboxBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMainInboxBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setSupportActionBar(binding.appBarMainInbox.toolbar);

        // כפתור FAB (אפשר לשנות בעתיד לשליחת מייל חדש)
        binding.appBarMainInbox.fab.setOnClickListener(view -> {
            Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                    .setAction("Action", null)
                    .setAnchorView(R.id.fab).show();
        });

        DrawerLayout drawer = binding.drawerLayout;
        NavigationView navigationView = binding.navView;

        // מגדיר את היעדים הראשיים בניווט
        mAppBarConfiguration = new AppBarConfiguration.Builder(
                R.id.nav_home, R.id.nav_gallery, R.id.nav_slideshow)
                .setOpenableLayout(drawer)
                .build();

        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main_inbox);
        NavigationUI.setupActionBarWithNavController(this, navController, mAppBarConfiguration);
        NavigationUI.setupWithNavController(navigationView, navController);

        // 💡 חיבור listener ידני ללחיצות בתפריט הצד
        navigationView.setNavigationItemSelectedListener(this);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // תפריט ה־Toolbar העליון (אם יש צורך)
        getMenuInflater().inflate(R.menu.main_inbox, menu);
        return true;
    }

    @Override
    public boolean onSupportNavigateUp() {
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment_content_main_inbox);
        return NavigationUI.navigateUp(navController, mAppBarConfiguration)
                || super.onSupportNavigateUp();
    }

    // 📌 כאן מתבצעת תגובה ללחיצה על כל פריט בתפריט הצד
    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.nav_labels_header) {
            showAddLabelDialog();
        } else if (id == R.id.nav_stared) {
            Snackbar.make(binding.getRoot(), "Starred clicked", Snackbar.LENGTH_SHORT).show();
        } else if (id == R.id.nav_draft) {
            Snackbar.make(binding.getRoot(), "Draft clicked", Snackbar.LENGTH_SHORT).show();
        } else if (id == R.id.nav_sent) {
            Snackbar.make(binding.getRoot(), "Sent clicked", Snackbar.LENGTH_SHORT).show();
        } else if (id == R.id.nav_spam) {
            Snackbar.make(binding.getRoot(), "Spam clicked", Snackbar.LENGTH_SHORT).show();
        } else if (id == R.id.nav_received) {
            Snackbar.make(binding.getRoot(), "Received clicked", Snackbar.LENGTH_SHORT).show();
        } else if (id == R.id.nav_tarsh) {
            Snackbar.make(binding.getRoot(), "Trash clicked", Snackbar.LENGTH_SHORT).show();
        }

        // סגור את ה־Drawer אחרי לחיצה
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
                        // בעתיד: שלח לשרת
                        Snackbar.make(binding.getRoot(), "Label added: " + labelName, Snackbar.LENGTH_SHORT).show();
                    } else {
                        Snackbar.make(binding.getRoot(), "Label name cannot be empty", Snackbar.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

}
