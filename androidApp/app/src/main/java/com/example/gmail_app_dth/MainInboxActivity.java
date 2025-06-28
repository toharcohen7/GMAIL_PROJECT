package com.example.gmail_app_dth;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.lifecycle.ViewModelProvider;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import com.example.gmail_app_dth.databinding.ActivityMainInboxBinding;
import com.google.android.material.navigation.NavigationView;
import com.google.android.material.snackbar.Snackbar;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;


public class MainInboxActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private AppBarConfiguration mAppBarConfiguration;
    private ActivityMainInboxBinding binding;

    private MainInboxViewModel viewModel;

    private static final int MENU_GROUP_LABELS = 123;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMainInboxBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        setSupportActionBar(binding.appBarMainInbox.toolbar);

        // אתחול ViewModel
        viewModel = new ViewModelProvider(this).get(MainInboxViewModel.class);

// תצפית על תוויות מהשרת
        viewModel.getLabelsLiveData().observe(this, labels -> {

            Set<String> systemLabels = new HashSet<>(Arrays.asList(
                    "Draft", "Sent", "Received", "Spam", "Trash"
            ));

            NavigationView navView = binding.navView;
            Menu menu = navView.getMenu();

            // מנקים את הקבוצה הקודמת
            menu.removeGroup(MENU_GROUP_LABELS);

            // מוסיפים כל Label לתפריט
            for (Label label : labels) {
                if (systemLabels.contains(label.getName())) {
                    continue; // דלג על תווית מערכת
                }

                MenuItem item = menu.add(MENU_GROUP_LABELS, Menu.NONE, Menu.NONE, label.getName());
                item.setCheckable(true);

                    // 🟠 אם האייקון שנשלח מהשרת לא קיים → מציג אייקון כללי
                    item.setIcon(R.drawable.ic_user_label_foreground); // ← תחליף בזה לאייקון הכללי שלך

            }

            navView.invalidate(); // מרענן את התפריט
            viewModel.fetchMailsByLabel("Received");
        });

// קריאה ראשונית לטעינת התוויות מהשרת
        viewModel.fetchLabels();


        // כפתור FAB (אפשר לשנות בעתיד לשליחת מייל חדש)
        binding.appBarMainInbox.fab.setOnClickListener(view ->
                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                        .setAction("Action", null)
                        .setAnchorView(R.id.fab).show()
        );

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

        // תצפית על תוצאה מ־ViewModel
        viewModel.getLabelCreationResult().observe(this, success -> {
            if (success != null) {
                if (success) {
                    Snackbar.make(binding.getRoot(), "Label created successfully!", Snackbar.LENGTH_SHORT).show();
                    viewModel.fetchLabels();
                } else {
                    Snackbar.make(binding.getRoot(), "Failed to create label", Snackbar.LENGTH_SHORT).show();
                }
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_inbox, menu);
        return true;
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
            viewModel.fetchMailsByLabel("Starred");
        } else {
            // נטען לפי שם התווית שנבחרה בתפריט (כולל Draft, Sent, וכו')
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
                        viewModel.createLabel(labelName); // קריאה ל־ViewModel
                    } else {
                        Snackbar.make(binding.getRoot(), "Label name cannot be empty", Snackbar.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }


}
