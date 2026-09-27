# BearBones On Amdroid

React/Vite app configured for Capacitor Android.

## Android prerequisites

- Node.js and npm
- Android Studio with the Android SDK and an emulator or connected device
- JDK 21 (Android Studio's bundled JBR is suitable)
- Android SDK discoverable through `ANDROID_HOME` or `android/local.properties`

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
```

On Windows, build a debug APK from PowerShell at the project root. If `JAVA_HOME` points to an older Java version, select Android Studio's bundled JDK 21 first:

```powershell
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
Set-Location android
.\gradlew.bat assembleDebug
```

Adjust the JDK path if Android Studio is installed elsewhere. On macOS or Linux, change to `android/` and run:

```bash
./gradlew assembleDebug
```

If using Command Prompt on Windows instead of PowerShell, run this from the project root:

```cmd
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd android
gradlew.bat assembleDebug
```

The APK is created at `android/app/build/outputs/apk/debug/app-debug.apk`. Transfer it to an Android phone and open it to install. Android may require permission to install apps from unknown sources.
