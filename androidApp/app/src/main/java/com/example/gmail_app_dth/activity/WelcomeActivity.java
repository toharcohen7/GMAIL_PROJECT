package com.example.gmail_app_dth.activity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;
import com.example.gmail_app_dth.R;

public class WelcomeActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);

        // Find the sign-in button
        Button signInButton = findViewById(R.id.btn_sign_in);
        Button signUpButton = findViewById(R.id.btn_sign_up);

        // Set click listener
        signInButton.setOnClickListener(v -> {
            // Create intent to navigate to SignInActivity
            Intent intent = new Intent(WelcomeActivity.this, SignInActivity.class);
            startActivity(intent);
        });
        signUpButton.setOnClickListener(v -> {
            Intent intent = new Intent(WelcomeActivity.this, SignUpActivity.class);
            startActivity(intent);
        });
    }
}