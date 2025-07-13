plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.example.gmail_app_dth"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.gmail_app_dth"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    buildFeatures {
        viewBinding = true
        buildConfig = true
    }
}

dependencies {
    implementation(libs.appcompat)
    implementation(libs.material)
    implementation(libs.activity)
    implementation(libs.constraintlayout)
    implementation(libs.lifecycle.livedata.ktx)
    implementation(libs.lifecycle.viewmodel.ktx)
    implementation(libs.navigation.fragment)
    implementation(libs.navigation.ui)

    annotationProcessor(libs.room.compiler)
    implementation(libs.room.runtime.android)
    implementation(libs.room.common)

    testImplementation(libs.junit)
    androidTestImplementation(libs.ext.junit)
    androidTestImplementation(libs.espresso.core)
    implementation(libs.retrofit)
    implementation(libs.retrofit.gson)
    implementation(libs.glide)
    annotationProcessor(libs.glide.compiler)
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
}

configurations.all {
    exclude(group = "com.intellij", module = "annotations")
}

val dotenvFile = rootProject.rootDir.resolve("../.env")
if (dotenvFile.exists()) {
    val envVars = dotenvFile.readLines()
        .filter { it.contains("=") }
        .associate {
            val (key, value) = it.split("=", limit = 2)
            key.trim() to value.trim().replace("\"", "")
        }
    println("✅ Loaded NODE_HOST=${envVars["NODE_HOST"]}, NODE_PORT=${envVars["NODE_PORT"]}")

    android {
        defaultConfig {
            buildConfigField("String", "NODE_HOST", "\"${envVars["NODE_HOST"]}\"")
            buildConfigField("String", "NODE_PORT", "\"${envVars["NODE_PORT"]}\"")
        }
    }
} else {
    println("⚠️ .env file not found at: ${dotenvFile.absolutePath}")
}
