@echo off
setlocal
set ROOT_DIR=%~dp0

echo ========================================================
echo Building HBPlus Secure Access Android APK...
echo ========================================================

set "JAVA_HOME=D:\Android Studio\jbr"
set "GRADLE_USER_HOME=D:\.gradle"
set "ANDROID_HOME=C:\Users\visha\AppData\Local\Android\Sdk"

echo [1/3] Building client web assets with Vite...
cd /d "%ROOT_DIR%apps\client"
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Web build failed.
    exit /b %ERRORLEVEL%
)

echo [2/3] Syncing assets with Android project...
call npx @capacitor/cli sync android
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Capacitor sync failed.
    exit /b %ERRORLEVEL%
)

echo [3/3] Compiling Android APK with Gradle (Java 21)...
cd /d "%ROOT_DIR%apps\client\android"
call .\gradlew.bat assembleDebug
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Gradle assembleDebug failed.
    exit /b %ERRORLEVEL%
)

cd /d "%ROOT_DIR%"

if exist "%ROOT_DIR%apps\client\android\app\build\outputs\apk\debug\app-debug.apk" (
    copy /Y "%ROOT_DIR%apps\client\android\app\build\outputs\apk\debug\app-debug.apk" "%ROOT_DIR%HBPlus-Access.apk" >nul
    echo.
    echo ========================================================
    echo SUCCESS: Android APK generated successfully!
    echo Output File: %ROOT_DIR%HBPlus-Access.apk
    echo ========================================================
) else (
    echo [ERROR] APK was not found.
    exit /b 1
)

endlocal
