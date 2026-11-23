# HBPlus Access - Secure Corporate Portal

> Cross-Platform Google Authentication with Strict `@hbplus.fit` Domain Restriction.
> Built with **React Native**, **React Native for Web**, **Node.js + Express**, **Firebase Authentication**, **Cloud Firestore**, and **Firebase Admin SDK**.
> Language: **100% Pure JavaScript (ES6+) & JSX** (Zero TypeScript).

---

## 1. Project Overview & Folder Structure

**HBPlus Access** is a modern, minimalist corporate portal that restricts application access exclusively to authenticated Google accounts ending in `@hbplus.fit`. Any attempt to sign in using another domain (e.g. `@gmail.com` or `@yahoo.com`) is immediately rejected, signed out from Firebase Auth, and presented with the exact security notice:
> `"Access restricted. Please login using your official domain email."`

### Monorepo Structure

```
hbplus-access/
├── apps/
│   ├── client/                          # React Native + React Native Web (Expo)
│   │   ├── public/                      # Static web assets & favicon
│   │   ├── src/
│   │   │   ├── assets/                  # Minimalist fitness-tech logo & Google SVGs
│   │   │   ├── components/
│   │   │   │   ├── auth/                # GoogleSignInButton.jsx
│   │   │   │   ├── common/              # AppButton, ErrorMessage, LoadingSpinner
│   │   │   │   ├── dashboard/           # ProfileCard.jsx, DashboardHeader.jsx
│   │   │   │   └── layout/              # AppHeader.jsx, AppLayout.jsx
│   │   │   ├── config/                  # firebase.js, environment.js
│   │   │   ├── contexts/                # AuthContext.jsx (Centralized Auth & Guard)
│   │   │   ├── hooks/                   # useAuth.js
│   │   │   ├── navigation/              # RootNavigator.jsx, navigationConfig.js
│   │   │   ├── screens/                 # LoginScreen.jsx, DashboardScreen.jsx
│   │   │   ├── services/                # authService.js, authService.web.js, authService.native.js, apiClient.js
│   │   │   ├── styles/                  # colors.js (Emerald & Slate), spacing.js, typography.js
│   │   │   ├── utils/                   # domainValidator.js, errorFormatter.js
│   │   │   ├── App.jsx                  # Main Application Component
│   │   │   └── index.js                 # Cross-platform entrypoint
│   │   ├── tests/                       # Domain validator unit tests
│   │   ├── app.json                     # Android & Web Expo configuration
│   │   ├── eas.json                     # Standalone Android APK preview build profile
│   │   ├── vite.config.js               # Web bundler configuration
│   │   └── package.json
│   │
│   └── server/                          # Node.js + Express REST API Gateway
│       ├── src/
│       │   ├── config/                  # environment.js, firebaseAdmin.js
│       │   ├── controllers/             # authController.js, userController.js
│       │   ├── middleware/              # authenticate.js, authorize.js, errorHandler.js, rateLimiter.js
│       │   ├── routes/                  # authRoutes.js, userRoutes.js, healthRoutes.js
│       │   ├── services/                # authService.js, userService.js
│       │   ├── utils/                   # domainValidator.js, apiResponse.js
│       │   ├── app.js                   # Express app configuration
│       │   └── server.js                # Server entrypoint (Port 5000)
│       ├── tests/                       # Domain, auth middleware, and RBAC tests
│       └── package.json
├── firebase/
│   └── firestore.rules                  # Strict Firestore Security Rules
├── docs/
│   └── API.md                           # REST API specification
├── eas.json                             # Root EAS build configuration
├── .env.example                         # Environment configuration template
├── package.json                         # Root orchestration scripts
└── README.md
```

---

## 2. Setup & Configuration

### Prerequisites
- **Node.js** (v20+ or v25+)
- **npm** (v10+ or v11+)
- **Firebase Project** with Google Authentication and Cloud Firestore enabled

### 1. Environment Variables
Copy `.env.example` into both `apps/server/.env` and `apps/client/.env`:

```bash
# Backend configuration
cp .env.example apps/server/.env

# Frontend configuration
cp .env.example apps/client/.env
```

#### Backend Settings (`apps/server/.env`):
```env
NODE_ENV=development
API_PORT=5000
ALLOWED_EMAIL_DOMAIN=hbplus.fit
CLIENT_ORIGIN=http://localhost:8081,http://localhost:3000,http://localhost:5173
ADMIN_EMAILS=admin@hbplus.fit
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./serviceAccountKey.json
FIREBASE_PROJECT_ID=hbplus-rivalry-20261122
```

#### Frontend Settings (`apps/client/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ALLOWED_EMAIL_DOMAIN=hbplus.fit
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. Firebase & Google OAuth Configuration
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication > Sign-in method > Google**.
3. Under **Authorized domains**, ensure `localhost` is listed.
4. Download the Service Account private key JSON from **Project Settings > Service accounts** and place it in `apps/server/serviceAccountKey.json`.

---

## 3. Authentication & Strict Domain Restriction Flow

```
┌────────────────────────────────────────────────────────┐
│             Web Browser / Android App                  │
└───────────────────────────┬────────────────────────────┘
                            │ Click "Continue with Google"
                            ▼
┌────────────────────────────────────────────────────────┐
│             Firebase Google OAuth 2.0                  │
│       Authenticates user & retrieves ID token          │
└───────────────────────────┬────────────────────────────┘
                            │
               Is email @hbplus.fit?
             /                       \
           NO                         YES
          /                             \
         ▼                               ▼
┌─────────────────────────┐   ┌──────────────────────────────┐
│  1. Sign out Firebase   │   │  Send Bearer ID Token to     │
│  2. Clear local session │   │  POST /api/auth/verify       │
│  3. Stay on Login page  │   └──────────────┬───────────────┘
│  4. Show exact banner:  │                  │
│     "Access restricted. │                  ▼
│      Please login using │   ┌──────────────────────────────┐
│      your official      │   │  Backend Firebase Admin      │
│      domain email."     │   │  verifies token signature,   │
└─────────────────────────┘   │  confirms @hbplus.fit, and   │
                              │  provisions user in Firestore│
                              └──────────────┬───────────────┘
                                             │
                                             ▼
                              ┌──────────────────────────────┐
                              │  Protected Dashboard Screen  │
                              │  (User Profile Card & Role)  │
                              └──────────────────────────────┘
```

### Firestore Security Rules (`firebase/firestore.rules`)
```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    function isHbPlusDomain() {
      return isAuthenticated() && request.auth.token.email.matches('.*@hbplus[.]fit$');
    }
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read, write: if isOwner(userId) && isHbPlusDomain();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 4. Commands to Run & Build

### Run on Localhost (Web & Backend)

1. **Install dependencies**:
   ```bash
   cd apps/server && npm install
   cd ../client && npm install --legacy-peer-deps
   cd ../..
   ```

2. **Start Backend Server (Port 5000)**:
   ```bash
   npm run dev:server
   # or: node apps/server/src/server.js
   ```

3. **Start Web Client (Port 8081)**:
   ```bash
   npm run web
   # or: cd apps/client && npm run web
   ```
   Open **http://localhost:8081** in your browser.

### Run Automated Tests
```bash
# Run all backend & frontend tests (36 automated tests)
npm test
```

### Run on Android Emulator
```bash
cd apps/client
npx expo run:android
```

### Build Standalone Android APK

#### Method 1: Cloud APK Build with EAS (Recommended)
`eas.json` is configured with a `preview` profile targeting a standalone installable APK (`"buildType": "apk"`):
```bash
cd apps/client
npx eas-cli build --platform android --profile preview
```

#### Method 2: Local Android Studio Build
1. Generate the native Android project:
   ```bash
   cd apps/client
   npx expo prebuild --platform android
   ```
2. Build the APK locally using Gradle:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   The compiled APK will be output at:
   `apps/client/android/app/build/outputs/apk/release/app-release.apk`.
