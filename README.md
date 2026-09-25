# BearBones On Amdroid

React/Vite app configured for Capacitor Android.

## Android prerequisites

- Node.js and npm
- Android Studio with the Android SDK and an emulator or connected device
- `ANDROID_HOME` configured if Android Studio does not configure it automatically

## Android workflow

Install dependencies, then open the native project in Android Studio:

```bash
npm install
npm run android:open
```

After changing the web app, update the Android project with:

```bash
npm run android:sync
```

The Android project is in `android/`. The application ID is `com.bearbones.app`.

## Build an APK without Android Studio

Android Studio is not required to build the app if the Android SDK and Java are installed. From the project root:

```bash
npm install
npm run android:sync
cd android
```

On Windows, build a debug APK with:

```powershell
.\gradlew.bat assembleDebug
```

On macOS or Linux, use:

```bash
./gradlew assembleDebug
```

The APK is created at `android/app/build/outputs/apk/debug/app-debug.apk`. Transfer it to an Android phone and open it to install. Android may require permission to install apps from unknown sources.
