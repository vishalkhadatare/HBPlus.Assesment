# HBPlus Secure Access Portal

> **Cross-Platform Google Authentication with Strict Domain Restriction (@hbplus.fit)**
> Built with React Native, React Native Web, Node.js & Express, Firebase Authentication, Cloud Firestore, and Firebase Admin SDK.
> Strict Language: **100% Pure JavaScript (ES6+) and JSX** (No TypeScript).

---

## 1. Project Overview & Problem Statement

**HBPlus Secure Access Portal** is an enterprise-grade cross-platform authentication gateway designed to restrict application access exclusively to verified employees and system administrators belonging to the official company domain: **`hbplus.fit`**.

### The Problem
Organizations often face security and compliance risks when internal tools allow generic social logins or use weak client-only validation. A client-side email check (e.g., checking `email.endsWith('@hbplus.fit')` in the browser or mobile UI) is easily bypassed via proxy tools, manipulated application state, or direct API requests.

### The Solution
HBPlus Secure Access Portal implements defense-in-depth:
1. **Google OAuth 2.0 via Firebase Authentication** ensures strong cryptographic identity proof.
2. **Server-Side Firebase Admin Verification** cryptographically verifies the Firebase ID Token on every protected request.
3. **Exact Server-Side Domain Allowlisting** validates the normalized email domain (`isAllowedEmailDomain()`), rejecting lookalikes (`hbplus.fit.example.com`), subdomains (`sub.hbplus.fit`), and personal accounts (`gmail.com`, `yahoo.com`).
4. **Exact Restriction Message**: Unauthorized authenticated attempts receive HTTP 403 Forbidden with the exact specified message:
   > `"Access restricted. Please login using your official domain email."`
5. **Trusted Role-Based Access Control (RBAC)** securely provisions users into Cloud Firestore and protects administrative endpoints against privilege escalation.
6. **Cross-Platform Shared Codebase** unifies business logic, UI components, and state management across **Web**, **Android**, and **iOS** using React Native and React Native Web.

---

## 2. Key Features

- **Google OAuth 2.0 Integration**: Single Sign-On using official Google identity providers.
- **Cross-Platform Support**: Unified React Native & React Native Web architecture for Web, Android, and iOS.
- **Strict Normalized Domain Restriction**: Server-side and client-side exact match against `@hbplus.fit`.
- **Zero Client Trust**: Frontend flags like `isAuthorized` are never trusted; backend independently verifies identity, domain, and role on every call.
- **Role-Based Access Control (RBAC)**: Supports `user` and `admin` roles stored in Cloud Firestore with server-enforced privileges.
- **Cloud Firestore User Profiles**: Automatic provisioning with server timestamps, role assignment, and active status tracking.
- **Firestore Security Rules**: Prevents unauthorized client writes, role spoofing, or tampering with account status.
- **Rate Limiting & Security Hardening**: Helmet security headers, CORS origin restrictions, and IP-based rate limiting on sensitive authentication routes.
- **Professional Minimalist UI/UX**: Polished corporate aesthetics with dark charcoal typography, subtle borders, restrained blue accents, and responsive layout across desktop and mobile.

---

## 3. Technology Stack

### Frontend (`apps/client`)
- **Framework**: React Native (0.76+) with React Native Web (0.19+)
- **Language**: JavaScript (ES6+), JSX
- **State Management**: React Context API (`AuthContext`), React Hooks
- **Authentication**: Firebase Authentication Web & Native Client SDKs
- **HTTP Client**: Reusable `apiClient` with automatic Bearer token injection
- **Tooling**: Vite (Web bundling & development), Metro/Expo (Native build configuration)

### Backend (`apps/server`)
- **Runtime**: Node.js (v20+ / v25+)
- **Framework**: Express.js (REST API architecture)
- **Language**: JavaScript (ES6+) with native `"type": "module"`
- **Authentication & Security**: Firebase Admin SDK (ID token cryptographic verification)
- **Database**: Cloud Firestore
- **Security Middlewares**: Helmet, CORS, Express Rate Limit, Morgan (safe logging)

### Automated Testing
- **Framework**: Jest with experimental ES modules
- **Integration**: Supertest for REST API endpoint verification
- **Coverage**: Unit domain validator tests, authentication middleware tests, authorization tests, and client utility tests.

---

## 4. System Architecture

```
┌────────────────────────────────────────────────────────┐
│             Web Browser / Android / iOS                │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│      Shared React Native / React Native Web Frontend    │
│  (AuthContext, RootNavigator, LoginScreen, Dashboard)  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               Firebase Authentication                  │
│       Google OAuth 2.0 Sign-In -> Firebase ID Token    │
└───────────────────────────┬────────────────────────────┘
                            │ Authorization: Bearer <token>
                            ▼
┌────────────────────────────────────────────────────────┐
│             Node.js + Express REST Backend             │
├────────────────────────────────────────────────────────┤
│ 1. Rate Limiting Middleware                            │
│ 2. Firebase Admin SDK verifyIdToken(token, true)       │
│ 3. Exact Email Domain Validation (@hbplus.fit)         │
│ 4. Firestore User Lookup & Role Resolution             │
│ 5. RBAC Authorization Middleware                       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                    Cloud Firestore                     │
│    (users collection: uid, role, isActive, timestamps) │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│           Authorized Corporate Dashboard & API         │
└────────────────────────────────────────────────────────┘
```

---

## 5. Folder Structure

```
hbplus-secure-access/
├── apps/
│   ├── client/
│   │   ├── public/
│   │   │   ├── favicon.svg
│   │   │   └── index.html
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   │   ├── images/
│   │   │   │   │   └── logo.svg
│   │   │   │   └── icons/
│   │   │   │       └── google.svg
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   │   ├── AppButton.jsx
│   │   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   │   ├── ErrorMessage.jsx
│   │   │   │   │   └── ProtectedContent.jsx
│   │   │   │   ├── auth/
│   │   │   │   │   └── GoogleSignInButton.jsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── StatCard.jsx
│   │   │   │   │   ├── ProfileCard.jsx
│   │   │   │   │   └── DashboardHeader.jsx
│   │   │   │   └── layout/
│   │   │   │       ├── AppHeader.jsx
│   │   │   │       └── AppLayout.jsx
│   │   │   ├── config/
│   │   │   │   ├── firebase.js
│   │   │   │   └── environment.js
│   │   │   ├── contexts/
│   │   │   │   └── AuthContext.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.js
│   │   │   │   └── useDashboard.js
│   │   │   ├── navigation/
│   │   │   │   ├── RootNavigator.jsx
│   │   │   │   ├── ProtectedNavigator.jsx
│   │   │   │   └── navigationConfig.js
│   │   │   ├── screens/
│   │   │   │   ├── LoginScreen.jsx
│   │   │   │   ├── DashboardScreen.jsx
│   │   │   │   ├── AccessDeniedScreen.jsx
│   │   │   │   └── NotFoundScreen.jsx
│   │   │   ├── services/
│   │   │   │   ├── authService.js
│   │   │   │   ├── authService.web.js
│   │   │   │   ├── authService.native.js
│   │   │   │   ├── apiClient.js
│   │   │   │   └── dashboardService.js
│   │   │   ├── styles/
│   │   │   │   ├── colors.js
│   │   │   │   ├── spacing.js
│   │   │   │   └── typography.js
│   │   │   ├── utils/
│   │   │   │   ├── domainValidator.js
│   │   │   │   └── errorFormatter.js
│   │   │   ├── App.jsx
│   │   │   └── index.js
│   │   ├── tests/
│   │   │   └── domainValidator.test.js
│   │   ├── app.json
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   └── package.json
│   │
│   └── server/
│       ├── src/
│       │   ├── config/
│       │   │   ├── environment.js
│       │   │   └── firebaseAdmin.js
│       │   ├── controllers/
│       │   │   ├── authController.js
│       │   │   ├── userController.js
│       │   │   └── dashboardController.js
│       │   ├── middleware/
│       │   │   ├── authenticate.js
│       │   │   ├── authorize.js
│       │   │   ├── errorHandler.js
│       │   │   ├── notFound.js
│       │   │   └── rateLimiter.js
│       │   ├── routes/
│       │   │   ├── authRoutes.js
│       │   │   ├── userRoutes.js
│       │   │   ├── dashboardRoutes.js
│       │   │   └── healthRoutes.js
│       │   ├── services/
│       │   │   ├── authService.js
│       │   │   ├── userService.js
│       │   │   └── dashboardService.js
│       │   ├── utils/
│       │   │   ├── domainValidator.js
│       │   │   └── apiResponse.js
│       │   ├── app.js
│       │   └── server.js
│       ├── tests/
│       │   ├── domainValidator.test.js
│       │   ├── authRoutes.test.js
│       │   └── authorization.test.js
│       └── package.json
├── firebase/
│   └── firestore.rules
├── docs/
│   └── API.md
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── eslint.config.js
```

---

## 6. Authentication and Authorization Flow

### Step 1: Application Initialization
1. Application boots in `App.jsx`, wrapping components in `AuthProvider`.
2. `onAuthStateChanged` listens for existing Firebase sessions.
3. Loading screen (`LoadingSpinner`) is displayed. Protected content never flashes.
4. If a session is restored, the ID token is fetched and validated against `POST /api/auth/verify`.
5. If verified, user lands directly on `DashboardScreen`; otherwise redirected to `LoginScreen` or `AccessDeniedScreen`.

### Step 2: Google Sign-In
1. User clicks **"Continue with Google"**.
2. Web invokes `signInWithPopup(auth, googleProvider)` with `prompt: 'select_account'`.
3. Native mobile invokes Google Play Services / iOS Google Sign-In and passes credential to Firebase.
4. ID token is retrieved from the authenticated Firebase User.

### Step 3: Strict Domain Validation
- Backend executes `isAllowedEmailDomain(email, configuredDomain)`:
  - Normalizes email to lowercase and trims whitespace.
  - Validates RFC email format.
  - Extracts the domain part after the `@` symbol.
  - Matches exact string equality against `hbplus.fit`.
  - Rejects missing emails, malformed emails, personal domains (`gmail.com`, `yahoo.com`), and suffix attacks (`hbplus.fit.example.com`).

### Step 4: Server-Side Token Verification & Provisioning
- The backend `authenticate` middleware:
  - Validates the `Authorization: Bearer <token>` header.
  - Verifies token cryptographically with `adminAuth.verifyIdToken(token, true)`.
  - Enforces `email_verified == true`.
  - Evaluates domain allowlist.
  - Looks up user in Firestore `users/{uid}`.
  - If user is newly authenticated, auto-provisions profile with default role `'user'` (or `'admin'` if listed in `ADMIN_EMAILS`).
  - Verifies `isActive !== false`.
  - Attaches `req.user` to the Express request.

### Step 5: Successful Authorization
- Backend returns HTTP 200 with user profile.
- Frontend stores authorized state and transitions to `DashboardScreen`.
- Dashboard fetches operational metrics via `GET /api/dashboard`.

### Step 6: Rejected Login (Unauthorized Domain)
- Backend returns HTTP 403 Forbidden with exact payload:
  ```json
  {
    "success": false,
    "message": "Access restricted. Please login using your official domain email.",
    "code": "DOMAIN_NOT_ALLOWED"
  }
  ```
- Client immediately signs out the unauthorized Firebase identity.
- Client transitions to `AccessDeniedScreen` displaying lock icon, the exact message, and options to retry with another Google account.

### Step 7: Logout
- User clicks "Sign Out".
- Client executes Firebase `signOut()`.
- Authentication and authorization state are purged from memory.
- Navigation redirects to `LoginScreen`.

---

## 7. Firebase Configuration Setup

### 1. Create Firebase Project
1. Navigate to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and enter `hbplus-secure-access`.

### 2. Enable Authentication & Google Provider
1. Go to **Build > Authentication > Sign-in method**.
2. Enable **Google** provider.
3. Set your project support email.
4. Under **Authorized domains**, ensure `localhost` and your production domain are added.

### 3. Register Web Application
1. Go to **Project Settings > General > Your apps > Add Web App**.
2. Copy the Firebase configuration object.
3. Populate `VITE_FIREBASE_*` variables in `apps/client/.env`.

### 4. Configure Android (Native)
1. Add Android app with package name `fit.hbplus.secureaccess`.
2. Generate SHA-1 fingerprint from your debug keystore:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
3. Add the SHA-1 in Firebase Console.
4. Download `google-services.json` and place in `apps/client/`.

### 5. Configure iOS (Native)
1. Add iOS app with bundle identifier `fit.hbplus.secureaccess`.
2. Download `GoogleService-Info.plist` and place in `apps/client/`.
3. Add reversed client ID to URL schemes in Xcode.

### 6. Firebase Admin Service Account (Backend)
1. Go to **Project Settings > Service accounts**.
2. Click **Generate new private key**.
3. Save the JSON file securely as `serviceAccountKey.json` inside `apps/server/` (do NOT commit to git).
4. Or configure `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` in `apps/server/.env`.

---

## 8. Firestore Security Rules

Deploy rules located at `firebase/firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

Key security guarantees in rules:
- Unauthenticated access is denied by default.
- Reads are permitted only to accounts authenticated with `@hbplus.fit` domain.
- Client creation (`create`) is blocked: user provisioning is strictly managed server-side via Firebase Admin SDK.
- Client updates (`update`) permit owner to change only non-sensitive fields; changing `role`, `isActive`, `uid`, or `email` is strictly blocked.
- Deletions are restricted to administrators.

---

## 9. Installation & Running Locally

### Prerequisites
- Node.js v20+ or v25+
- npm v10+ or v11+
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/vishalkhadatare/rivalry.git
cd rivalry
```

### Step 2: Configure Environment Variables
Copy `.env.example` into server and client directories:

```bash
# Backend environment
cp .env.example apps/server/.env

# Frontend environment
cp .env.example apps/client/.env
```

### Step 3: Install Dependencies
```bash
# Install backend dependencies
cd apps/server
npm install

# Install client dependencies
cd ../client
npm install --legacy-peer-deps

cd ../..
```

### Step 4: Start Backend API
```bash
cd apps/server
npm run dev
# Server runs on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### Step 5: Start Frontend Web Client
```bash
cd apps/client
npm run web
# Web client opens at http://localhost:8081
```

---

## 10. Automated Testing

The project includes unit and integration tests covering domain validation, Firebase token verification, role-based authorization, and client error formatting.

### Run Backend Tests (28 tests)
```bash
cd apps/server
npm test
```
Verifies:
- `domainValidator.test.js`: Exact domain matching, uppercase normalization, rejection of lookalike and public domains.
- `authRoutes.test.js`: ID token verification, missing token rejection, unverified email rejection, unauthorized domain rejection with exact message.
- `authorization.test.js`: Dashboard route protection, profile fetching, admin user directory access control, privilege escalation prevention.

### Run Client Tests (7 tests)
```bash
cd apps/client
npm test
```
Verifies:
- Client domain validator matching.
- Exact restriction message formatting on `DOMAIN_NOT_ALLOWED`.

---

## 11. REST API Documentation Summary

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server uptime and health status |
| `POST` | `/api/auth/verify` | Authenticated | Token verification, domain validation & user provisioning |
| `GET` | `/api/auth/me` | Authenticated | Current authenticated user profile |
| `GET` | `/api/dashboard` | Authenticated | Corporate dashboard statistics and resources |
| `GET` | `/api/users/me` | Authenticated | Current user's Firestore document |
| `PATCH` | `/api/users/me` | Authenticated | Updates safe profile fields (`displayName`, `photoURL`) |
| `GET` | `/api/admin/users` | Admin Only | Corporate user directory (rejects non-admin with 403) |

Full documentation with request and response payloads is available in [docs/API.md](docs/API.md).

---

## 12. Security Notes & Best Practices

1. **Tokens Never Logged**: Server logging via Morgan explicitly omits `Authorization` headers.
2. **Cryptographic Check**: Token verification uses `adminAuth.verifyIdToken(token, true)` with revocation checking enabled.
3. **No Private Keys in Client**: Mobile and web clients only hold public Firebase identifiers.
4. **Rate Limiting**: Authentication endpoints are rate-limited to 50 requests per 15 minutes per IP to prevent brute-force attacks.
5. **No Client Privilege Escalation**: Role attributes sent in `PATCH /api/users/me` or other user endpoints are strictly discarded.

---

## 13. License

Corporate Confidential & Proprietary. Copyright © 2026 HBPlus Fitness & Health Ltd.
All rights reserved.
