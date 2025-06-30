package com.example.gmail_app_dth;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

public class ImageUtils {

    public static Bitmap decodeBase64Image(String base64WithOptionalPrefix) {
        if (base64WithOptionalPrefix == null || base64WithOptionalPrefix.isEmpty()) return null;

        String base64;
        if (base64WithOptionalPrefix.contains(",")) {
            base64 = base64WithOptionalPrefix.split(",")[1];
        } else {
            base64 = base64WithOptionalPrefix;
        }

        try {
            byte[] decodedBytes = Base64.decode(base64, Base64.DEFAULT);
            return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
