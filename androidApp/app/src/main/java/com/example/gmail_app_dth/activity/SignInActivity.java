package com.example.gmail_app_dth.activity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;

import com.example.gmail_app_dth.R;
import com.example.gmail_app_dth.requests.SignInRequest;
import com.example.gmail_app_dth.viewmodel.UserViewModel;


public class SignInActivity extends AppCompatActivity {

    private UserViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_sign_in);

        EditText etUserName = findViewById(R.id.editTextText);
        EditText etPassword = findViewById(R.id.editTextTextPassword);
        Button btnSignIn = findViewById(R.id.signInButton);
        TextView tvSignUp = findViewById(R.id.tv_sign_up);

        viewModel = new ViewModelProvider(this).get(UserViewModel.class);

        btnSignIn.setOnClickListener(v -> {
            String userName = etUserName.getText().toString().trim();
            String password = etPassword.getText().toString();


            SignInRequest request = new SignInRequest(userName, password);
            viewModel.signIn(request, this);
        });

        viewModel.getLoginStatus().observe(this, status -> {
            if (status.equals("success")) {
                Toast.makeText(this, "Login successful!", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(this, MainInboxActivity.class ));
                finish();
            } else {
                Toast.makeText(this, status, Toast.LENGTH_LONG).show();
            }
        });

        tvSignUp.setOnClickListener(v -> {
            Intent intent = new Intent(SignInActivity.this, SignUpActivity.class);
            startActivity(intent);
        });


    }
}