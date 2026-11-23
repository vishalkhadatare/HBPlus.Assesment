<div align="center">

# ⬢ HB Plus (HB+)
### Cross-Platform Role-Based Access & Workforce Management

[![Live Web App](https://img.shields.io/badge/Live_Web_App-HBPlus_on_Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://vectorvault99.netlify.app/)
[![Download Android APK](https://img.shields.io/badge/Download_APK-HBPlus--Access.apk-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/vishalkhadatare/rivalry/raw/main/HBPlus-Access.apk)
[![React Native](https://img.shields.io/badge/React_Native_for_Web-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://necolas.github.io/react-native-web/)
[![Firebase](https://img.shields.io/badge/Firebase_Auth_%26_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Jest](https://img.shields.io/badge/Jest_Tests-48_Passed-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

<br/>

### 🚀 Direct Links

| 🌐 Live Web Application | 📱 Standalone Android APK | 💻 GitHub Repository |
| :---: | :---: | :---: |
| **[HBPlus on Netlify](https://vectorvault99.netlify.app/)** | **[Download HBPlus-Access.apk](https://github.com/vishalkhadatare/rivalry/raw/main/HBPlus-Access.apk)** | **[vishalkhadatare/rivalry](https://github.com/vishalkhadatare/rivalry)** |

---

</div>

## 📌 Project Overview

HB Plus is a cross-platform role-based access and workforce management application built with a single shared codebase using **React Native for Web** and **Capacitor Android**.

The application restricts access exclusively to authenticated accounts from the official domain (**`@hbplus.fit`**). Any unauthorized domain (such as `@gmail.com`) is rejected with the exact error message:
> `"Access restricted. Please login using your official domain email."`

---

## 🛠️ Technology Stack

<div align="center">

| Layer | Technologies | Role in Application |
| :--- | :--- | :--- |
| **Mobile & Web Client** | ![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=flat-square&logo=react&logoColor=black) ![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=flat-square&logo=vite&logoColor=white) | Unified component hierarchy across Web and Android APK |
| **Android Container** | ![Capacitor](https://img.shields.io/badge/Capacitor_7-119EFF?style=flat-square&logo=capacitor&logoColor=white) ![Android](https://img.shields.io/badge/Android_SDK-3DDC84?style=flat-square&logo=android&logoColor=white) ![Gradle](https://img.shields.io/badge/Gradle_8-02303A?style=flat-square&logo=gradle&logoColor=white) | Native Android packaging and Java 21 build toolchain |
| **Backend API** | ![Node.js](https://img.shields.io/badge/Node.js_20-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) | REST API, token verification middleware, domain firewall |
| **Auth & Database** | ![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-FFA000?style=flat-square&logo=firebase&logoColor=black) ![Firestore](https://img.shields.io/badge/Cloud_Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black) | Google OAuth 2.0, custom role claims, user database |
| **Hosting & Deploy** | ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white) | Global edge hosting with SPA rewrite rules (`_redirects`) |
| **Testing** | ![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white) | 48 automated unit & integration tests (`npm test`) |

</div>

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              HB PLUS SYSTEM ARCHITECTURE                               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  📱 CLIENT PLATFORMS (Unified Codebase)                                                │
│  ├── Android APK: Standalone package compiled via Capacitor 7 & Gradle                 │
│  ├── Mobile Web: Responsive touch layout on Netlify                                    │
│  └── Desktop Web: Split-screen executive portal                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  🧭 AUTHENTICATION & ROUTE GUARDS                                                      │
│  ├── /                 ──► Role Select (Admin or User choice)                          │
│  ├── /login/user       ──► Google OAuth 2.0 & Email/Password for employees             │
│  ├── /login/admin      ──► Administrator credential login (No public signup)           │
│  └── /access-denied    ──► Rejection screen for unauthorized domains                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  🛡️ 4-TIER SECURITY PIPELINE                                                           │
│  ├── Tier 1: Client pure validator isAllowedEmail(email, "hbplus.fit")                │
│  ├── Tier 2: Express middleware verifying Firebase ID token & domain                  │
│  ├── Tier 3: Cryptographic Firebase custom claims ({ role: 'admin' | 'user' })        │
│  └── Tier 4: Cloud Firestore security rules enforcing domain regex at DB engine        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ☁️ BACKEND & CLOUD SERVICES                                                           │
│  ├── Express API (Port 5000): /api/auth/provision, /api/attendance/checkin             │
│  ├── Firebase Auth: Google OAuth 2.0, token issue, intruder purge worker               │
│  └── Cloud Firestore: users/{uid} profiles and immutable auditLogs                     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Flow Diagram

```mermaid
flowchart TD
    subgraph Clients [Client Applications]
        A1[Android Standalone APK]
        A2[Mobile Web App]
        A3[Desktop Web Portal]
    end

    subgraph Entry [Entry Gateways]
        B[Role Selection Portal]
        C[User Workspace Login]
        D[Admin Control Login]
    end

    subgraph SecurityTier [4-Tier Security Pipeline]
        E[1. Client-Side Domain Validator]
        F[2. Express Security Middleware]
        G[3. Cryptographic Role Claims]
        H[4. Cloud Firestore Security Rules]
    end

    subgraph BackendAPI [Express API Backend]
        I[Auth Provisioning Service]
        J[Geofence Attendance Engine]
        K[Workforce Governance API]
        L[Intruder Eviction Worker]
    end

    subgraph CloudInfra [Firebase Cloud Services]
        M[(Firebase Authentication)]
        N[(Cloud Firestore Database)]
    end

    A1 --> B
    A2 --> B
    A3 --> B
    B --> C
    B --> D
    C --> E
    D --> E
    E --> F
    F --> G
    G --> I
    G --> J
    G --> K
    F --> L
    I --> M
    L --> M
    I --> N
    J --> N
    K --> N
    N --> H
```

---

## 🔒 Authentication & Domain Restriction Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DOMAIN RESTRICTION FLOWCHART                                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   User clicks "Continue with Google"                                                   │
│                 │                                                                      │
│                 ▼                                                                      │
│   Google OAuth Account Chooser                                                         │
│                 │                                                                      │
│                 ▼                                                                      │
│   Check: email.endsWith("@hbplus.fit")?                                                │
│                 │                                                                      │
│         ┌───────┴──────────────────────────┐                                           │
│         │ NO                               │ YES                                       │
│         ▼                                  ▼                                           │
│   [UNAUTHORIZED DOMAIN]              [AUTHORIZED DOMAIN]                               │
│   e.g. user@gmail.com                e.g. employee@hbplus.fit                          │
│         │                                  │                                           │
│         ▼                                  ▼                                           │
│   Purge user session via             POST /api/auth/provision                          │
│   adminAuth.deleteUser(uid)                │                                           │
│         │                                  ▼                                           │
│         ▼                            Attach custom claim { role: 'user' }              │
│   Show Error:                              │                                           │
│   "Access restricted. Please login         ▼                                           │
│    using your official domain email." Grant access: User Dashboard                     │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Employee as Employee or Intruder
    participant Client as React Native App
    participant API as Express API Server
    participant AdminSDK as Firebase Admin SDK
    participant Firestore as Cloud Firestore

    Employee->>Client: Sign in with Google or Email
    Client->>Client: Validate email domain
    alt Email is from unauthorized domain (e.g. @gmail.com)
        Client->>API: Report unauthorized session
        API->>AdminSDK: adminAuth.deleteUser(uid)
        AdminSDK-->>API: User account purged
        Client->>Employee: Display: "Access restricted. Please login using your official domain email."
    else Email ends in @hbplus.fit
        Client->>API: POST /api/auth/provision
        API->>AdminSDK: verifyIdToken(token)
        API->>AdminSDK: setCustomUserClaims(role=user)
        API->>Firestore: Upsert user document
        Firestore-->>API: Confirmed
        API-->>Client: Provisioned successfully
        Client->>Employee: Redirect to User Dashboard
    end
```

---

## 📋 Features Checklist

| Feature | Implementation | Status |
| :--- | :--- | :---: |
| **Cross-Platform React Native** | Same codebase powers Mobile Web, Desktop Web, and Android APK | ✅ Complete |
| **Google OAuth 2.0** | Firebase Google Sign-In with account selector & domain hint | ✅ Complete |
| **Domain Restriction (`@hbplus.fit`)** | Validated across client, server middleware, and database rules | ✅ Complete |
| **Exact Error Message** | `"Access restricted. Please login using your official domain email."` | ✅ Complete |
| **Protected Dashboard** | `AuthGate` blocks unauthenticated direct URL navigation | ✅ Complete |
| **Role-Based Access** | User Workspace (Teal `#0F766E`) and Admin Control (`#C2410C`) | ✅ Complete |
| **User Data Storage** | Stored in Cloud Firestore `users/{uid}` and `auditLogs/{id}` | ✅ Complete |
| **Logout Functionality** | Revokes tokens, clears session, and redirects to role selection | ✅ Complete |
| **Vector Country Flag Picker** | 50+ SVG flags with dialing codes and search for mobile numbers | ✅ Complete |
| **Plain Data-Entry Inputs** | Focus retention without nested remounts or modal overlays | ✅ Complete |
| **Netlify Deployment** | Configured via `netlify.toml` and `apps/client/public/_redirects` | ✅ Complete |
| **Downloadable Android APK** | Built package committed at `/HBPlus-Access.apk` (~5.5 MB) | ✅ Complete |

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- Node.js 18+ (Node 20+ LTS recommended)
- Java 17 or 21 (for Android APK builds)
- Android SDK (for local APK generation)

### 1. Clone & Install
```bash
git clone https://github.com/vishalkhadatare/rivalry.git
cd rivalry
npm install
```

### 2. Environment Variables
Create `.env` in `apps/server/` and `apps/client/`:

**`apps/server/.env`:**
```env
PORT=5000
ALLOWED_DOMAIN=hbplus.fit
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

**`apps/client/.env`:**
```env
VITE_API_URL=http://localhost:5000
VITE_ALLOWED_EMAIL_DOMAIN=hbplus.fit
VITE_FIREBASE_API_KEY=AIzaSyDBpiydAHXbyfClkfjMqvePoqrS9vM17X8
VITE_FIREBASE_AUTH_DOMAIN=hbplus-rivalry-20261122.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hbplus-rivalry-20261122
```

### 3. Run Locally
```bash
# Terminal 1: Backend API (Port 5000)
npm run dev:server

# Terminal 2: Web Client (Port 8081)
npm run dev:client
```
Open **[http://localhost:8081](http://localhost:8081)** in your browser.

---

## 🛠️ Provisioning the First Admin Account

Admin accounts cannot be created publicly through the UI. Use the CLI tool:

```bash
ADMIN_EMAIL="admin@hbplus.fit" ADMIN_PASSWORD="YourPassword123!" node scripts/create-admin.js
```
This script validates the email against `@hbplus.fit`, creates the user in Firebase Auth, assigns `{ role: 'admin' }`, and creates the Firestore record.

---

## 📦 Building the Android APK

To build the Android APK locally:

```bash
# Windows
.\build-apk.bat

# Or using npm
npm run build:client
cd apps/client/android && gradlew.bat assembleDebug
```
Output file: `HBPlus-Access.apk` (~5.5 MB).

---

## 🧪 Automated Tests

Run the full test suite covering domain validators, RBAC authorization, responsive tokens, and flag mappings:

```bash
npm test
```

```text
PASS apps/server/tests/authorization.test.js
PASS apps/server/tests/authRoutes.test.js
PASS apps/server/tests/domainValidator.test.js
PASS apps/client/tests/responsiveAndTokens.test.js
PASS apps/client/tests/countryFlags.test.js
PASS apps/client/tests/domainValidator.test.js

Test Suites: 6 passed, 6 total
Tests:       48 passed, 48 total
Snapshots:   0 total
Time:        2.85 s
```

---

## 📄 License
MIT License. © HB Plus.
