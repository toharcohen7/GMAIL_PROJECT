package com.example.gmail_app_dth.activity;

import android.app.DatePickerDialog;
import android.app.AlertDialog;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.InputType;
import android.util.Base64;

import android.util.Log;
import android.widget.Button;

import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.ViewModelProvider;

import com.bumptech.glide.Glide;
import com.example.gmail_app_dth.R;
import com.example.gmail_app_dth.requests.UserRegistrationRequest;
import com.example.gmail_app_dth.viewmodel.UserViewModel;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Calendar;
import java.util.Locale;

public class SignUpActivity extends AppCompatActivity {

    private UserViewModel userViewModel;

    private ImageButton uploadPhotoButton;
    private String base64Image = null;
    private ActivityResultLauncher<Intent> galleryLauncher;
    private ActivityResultLauncher<Uri> cameraLauncher;
    private Uri cameraImageUri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_sign_up);

        EditText etUserName = findViewById(R.id.userNameEdit);
        EditText etPassword = findViewById(R.id.passwordEdit);
        EditText etConfirmPassword = findViewById(R.id.confirmPasswordEdit);
        EditText etFirstName = findViewById(R.id.firstNameEdit);
        EditText etLastName = findViewById(R.id.lastNameEdit);
        EditText etBirthDate = findViewById(R.id.birthDateEdit);
        Spinner spGender = findViewById(R.id.genderSpinner);
        Button btnRegister = findViewById(R.id.signUpButton_ToSignIn);
        uploadPhotoButton = findViewById(R.id.uploadPhoto);

        userViewModel = new ViewModelProvider(this).get(UserViewModel.class);

        if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.CAMERA}, 101);
        }


        etBirthDate.setInputType(InputType.TYPE_NULL);
        etBirthDate.setFocusable(false);
        etBirthDate.setOnClickListener(v -> {
            final Calendar calendar = Calendar.getInstance();
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONTH);
            int day = calendar.get(Calendar.DAY_OF_MONTH);

            DatePickerDialog datePickerDialog = new DatePickerDialog(
                    SignUpActivity.this,
                    (view, selectedYear, selectedMonth, selectedDay) -> {
                        String formattedDate = String.format(Locale.getDefault(), "%04d-%02d-%02d", year, month, day);
                        etBirthDate.setText(formattedDate);
                    },
                    year, month, day
            );

            datePickerDialog.getDatePicker().setMaxDate(System.currentTimeMillis());
            datePickerDialog.show();
        });

        uploadPhotoButton.setOnClickListener(v -> showImageSourceDialog());

        galleryLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                        Uri selectedImageUri = result.getData().getData();
                        handleImage(selectedImageUri);
                    }
                });

        cameraLauncher = registerForActivityResult(
                new ActivityResultContracts.TakePicture(),
                result -> {
                    if (result && cameraImageUri != null) {
                        handleImage(cameraImageUri);
                    }
                });

        btnRegister.setOnClickListener(v -> {
            String userName = etUserName.getText().toString().trim();
            String password = etPassword.getText().toString();
            String confirmPassword = etConfirmPassword.getText().toString();
            String firstName = etFirstName.getText().toString().trim();
            String lastName = etLastName.getText().toString().trim();
            String gender = spGender.getSelectedItem().toString();
            String birthDate = etBirthDate.getText().toString().trim();

            if (base64Image == null) {
                Toast.makeText(this, "missing profile photo", Toast.LENGTH_SHORT).show();
                return;
            }

            if (!password.equals(confirmPassword)) {
                Toast.makeText(this, "password and confirm password do not match", Toast.LENGTH_SHORT).show();
                return;
            }


            UserRegistrationRequest request = new UserRegistrationRequest(
                    userName, password, confirmPassword,
                    firstName, lastName, gender, birthDate, base64Image
            );

            userViewModel.register(request);
        });

        userViewModel.getRegistrationStatus().observe(this, status -> {
            if (status.equals("success")) {
                Toast.makeText(this, "Registration successful!", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(SignUpActivity.this, SignInActivity.class));
                finish();
            } else {
                Toast.makeText(this, "Error: " + status, Toast.LENGTH_LONG).show();
            }
        });
    }

    private void showImageSourceDialog() {
        String[] options = {"camera", "gallery"};

        new AlertDialog.Builder(this)
                .setTitle("Select a resource")
                .setItems(options, (dialog, which) -> {
                    if (which == 0) openCamera();
                    else openGallery();
                })
                .show();
    }

    private void openGallery() {
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        galleryLauncher.launch(intent);
    }

    private void openCamera() {
        ContentValues values = new ContentValues();
        values.put(MediaStore.Images.Media.TITLE, "New Picture");
        values.put(MediaStore.Images.Media.DESCRIPTION, "From the Camera");

        cameraImageUri = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
        cameraLauncher.launch(cameraImageUri);
    }

    private void handleImage(Uri imageUri) {
        try {
            InputStream inputStream = getContentResolver().openInputStream(imageUri);
            Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
            Glide.with(this).load(bitmap).circleCrop().into(uploadPhotoButton);

            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.JPEG, 90, stream);
            byte[] byteArray = stream.toByteArray();

            String base64 = Base64.encodeToString(byteArray, Base64.NO_WRAP);
            base64Image = "data:image/jpeg;base64," + base64;

        } catch (Exception e) {
            Log.e("UserRepository", "Error while parsing image", e);
        }
    }

}
