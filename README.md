<div align="center">

# ⬢ HB Plus (HB+)
### Enterprise-Grade Cross-Platform Workforce & Secure Access Portal

[![React Native](https://img.shields.io/badge/React_Native_for_Web-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://necolas.github.io/react-native-web/)
[![Android](https://img.shields.io/badge/Android_APK-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://developer.android.com/)
[![Firebase](https://img.shields.io/badge/Firebase_Auth_%26_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Node.js](https://img.shields.io/badge/Node.js_Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Jest](https://img.shields.io/badge/Jest_Test_Suite-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>A unified, zero-trust workforce governance portal engineered for Android, Web, and Desktop.</b><br/>
  Featuring dual-persona design language, strict <code>@hbplus.fit</code> domain isolation, 1-tap geofenced attendance, and instant vector flag selectors.
</p>

[Key Features](#-key-features) • [System Architecture](#-system-architecture) • [Colourful Technology Stack](#-colourful-technology-stack) • [Security & Domain Governance](#-security--domain-governance) • [Quick Start](#-quick-start) • [Building Android APK](#-building-the-android-apk)

---

</div>

## 🌟 Key Features

<table>
  <tr>
    <td width="50%">
      <h3>🏢 Dual-Persona Experience</h3>
      <ul>
        <li><b>User Workspace:</b> Calming teal-to-emerald gradient theme (<code>#0F766E → #14B8A6</code>), shift countdowns, 1-tap geofenced attendance check-in, leave balances, and net salary slips.</li>
        <li><b>Admin Control Room:</b> Warm coral-orange theme (<code>#C2410C → #F97316</code>), real-time attendance trends (30-day analytics), headcount SLA, approval queues, and live audit logging.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🛡️ Zero-Trust Domain Enforcement</h3>
      <ul>
        <li><b>Strict <code>@hbplus.fit</code> Domain Gate:</b> 4-tier security validation across client validators, Express API middleware, Cloud Firestore database rules, and router navigation guards.</li>
        <li><b>Automated Intruder Eviction:</b> Rogue accounts (such as unauthorized <code>@gmail.com</code> logins via OAuth) are purged instantly via Firebase Admin SDK.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🌍 Global Mobile Number Suite</h3>
      <ul>
        <li><b>Fast SVG Vector Flags:</b> Integrated country picker supporting 50+ countries with instant search, crisp rendering, and zero bitmap blur across all screen densities.</li>
        <li><b>Overflow-Safe Layout:</b> Dynamic flex system that prevents mobile number truncation on Android devices of any width.</li>
      </ul>
    </td>
    <td width="50%">
      <h3>⚡ Plain Data-Entry System</h3>
      <ul>
        <li><b>Seamless Input Focus:</b> Eliminated floating modal boxes and nested component remounts for fluid, distraction-free text entry.</li>
        <li><b>Cross-Platform Parity:</b> Identical touch feel, animations, and typography across mobile web and native Android APK.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🎨 Colourful Technology Stack

<div align="center">

### Frontend & Mobile Engine
| Technology | Badge | Role in HB Plus |
| :--- | :--- | :--- |
| **React Native for Web** | ![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=flat-square&logo=react&logoColor=black) | Unified component hierarchy across Web and Android |
| **React 18** | ![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB) | Core view layer and state management |
| **Vite 6** | ![Vite](https://img.shields.io/badge/Vite_6.x-646CFF?style=flat-square&logo=vite&logoColor=white) | Ultra-fast client bundler and HMR dev server |
| **Capacitor 7** | ![Capacitor](https://img.shields.io/badge/Capacitor_7-119EFF?style=flat-square&logo=capacitor&logoColor=white) | Native Android bridge and container runtime |
| **Android SDK & Gradle** | ![Android Gradle](https://img.shields.io/badge/Gradle_8-02303A?style=flat-square&logo=gradle&logoColor=white) | Native APK compilation with Java 21 toolchain |
| **Lucide Icons** | ![Lucide](https://img.shields.io/badge/Lucide_Vector-F56565?style=flat-square&logo=feather&logoColor=white) | Lightweight, consistent 2px stroke icon system |

<br/>

### Backend & Cloud Infrastructure
| Technology | Badge | Role in HB Plus |
| :--- | :--- | :--- |
| **Node.js 20+** | ![NodeJS](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) | High-performance asynchronous JavaScript runtime |
| **Express.js** | ![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) | RESTful API server with custom security middleware |
| **Firebase Auth** | ![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-FFA000?style=flat-square&logo=firebase&logoColor=black) | Google OAuth 2.0 & Email/Password authentication |
| **Cloud Firestore** | ![Firestore](https://img.shields.io/badge/Cloud_Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black) | Real-time NoSQL database governed by security rules |
| **Firebase Admin SDK** | ![Admin SDK](https://img.shields.io/badge/Firebase_Admin-F57C00?style=flat-square&logo=firebase&logoColor=white) | Privileged user management and custom claims assignment |

<br/>

### Quality Assurance & Tooling
| Technology | Badge | Role in HB Plus |
| :--- | :--- | :--- |
| **Jest** | ![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white) | Comprehensive unit & integration testing suite (48 tests) |
| **Babel** | ![Babel](https://img.shields.io/badge/Babel_Compiler-F9DC3E?style=flat-square&logo=babel&logoColor=black) | ESNext and JSX transpilation |
| **PowerShell / Bash** | ![PowerShell](https://img.shields.io/badge/PowerShell-5391FE?style=flat-square&logo=powershell&logoColor=white) | 1-click APK compilation & build automation scripts |

</div>

---

## 🏗️ System Architecture

HB Plus utilizes a tiered architecture where security boundaries are strictly enforced across transport, identity, and persistence layers:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              HB PLUS SYSTEM ARCHITECTURE                               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  📱 CLIENT PLATFORMS (Unified React Native Codebase)                                   │
│  ├── Android Standalone APK (Capacitor 7 + Java 21)                                    │
│  ├── Mobile Web App (Responsive Web Touch Engine)                                      │
│  └── Desktop Web Portal (Split-Screen Executive Interface)                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  🧭 ACCESS GATEWAY & ROLE ROUTING                                                      │
│  ├── Role Selection (/) ──────────────────────────────────────┐                         │
│  │   ├── User Workspace (/login/user) ────────────────────────┼─► 4-Tier Security Gate │
│  │   └── Admin Control (/login/admin) ────────────────────────┘                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  🛡️ 4-TIER SECURITY & DOMAIN FIREWALL                                                 │
│  ├── Tier 1: Client-Side Pure Validator (isAllowedEmail)                               │
│  ├── Tier 2: Express Security Middleware (ID Token & Domain Signature Check)            │
│  ├── Tier 3: Cryptographic Role Claims ({ role: 'admin' | 'user' })                    │
│  └── Tier 4: Cloud Firestore Security Rules (Direct DB Engine Guard)                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ⚙️ NODE.JS / EXPRESS BACKEND (Port 5000)                                              │
│  ├── /api/auth/provision       ──► Validates Domain & Assigns Cryptographic Claims     │
│  ├── /api/attendance/checkin   ──► Geofence Radius & Live Timestamp Audit              │
│  ├── /api/admin/workforce      ──► Workforce Analytics, Trends & Approvals             │
│  └── Intruder Eviction Worker  ──► Auto-purges unauthorized accounts via Admin SDK     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ☁️ CLOUD INFRASTRUCTURE & PERSISTENCE                                                 │
│  ├── Firebase Auth Engine (OAuth 2.0 & JWT ID Tokens)                                  │
│  └── Cloud Firestore (users/{uid} | auditLogs/{id})                                    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Interactive Flow Diagram

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

## 🔒 Security & Domain Governance

Security in HB Plus is non-negotiable. Domain restrictions are never delegated solely to client-side checks.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                     ZERO-TRUST DOMAIN ENFORCEMENT PIPELINE                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [ Employee or Intruder ]                                                             │
│              │                                                                         │
│              ▼                                                                         │
│   [ Step 1: Client Entry ] ──► Enter credentials / Google OAuth                        │
│              │                                                                         │
│              ▼                                                                         │
│   [ Step 2: Domain Check ] ──► isAllowedEmail(email, "hbplus.fit")                     │
│              │                                                                         │
│              ├───────────────────────────────────┐                                     │
│              │ (FAILED: e.g. @gmail.com)         │ (PASSED: @hbplus.fit)               │
│              ▼                                   ▼                                     │
│   [ Intruder Detected! ]              [ POST /api/auth/provision ]                     │
│              │                                   │                                     │
│              ▼                                   ▼                                     │
│   [ adminAuth.deleteUser(uid) ]       [ Cryptographic Role Claim ]                     │
│   Account permanently destroyed       Custom claim { role: 'user' } set                │
│              │                                   │                                     │
│              ▼                                   ▼                                     │
│   [ Access Denied View ]              [ Access Granted: User Dashboard ]               │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Authentication Sequence Flow

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
    alt Email is from external domain
        Client->>API: Report unauthorized session
        API->>AdminSDK: adminAuth.deleteUser(uid)
        AdminSDK-->>API: User permanently purged
        Client->>Employee: Display Access Denied
    else Email belongs to company domain
        Client->>API: POST /api/auth/provision
        API->>AdminSDK: verifyIdToken(token)
        API->>AdminSDK: setCustomUserClaims(role=user)
        API->>Firestore: Upsert user document
        Firestore-->>API: Confirmed
        API-->>Client: Provisioned successfully
        Client->>Employee: Redirect to User Dashboard
    end
```

### The 4 Security Layers:
1. **Client Pure Validator (`isAllowedEmail`)**: Rejects non-ASCII characters, Unicode homoglyphs, subdomains, quoted prefixes, and external domains before requests leave the client.
2. **Server Middleware**: Cryptographically verifies the Firebase ID token signature and claims. Non-conforming accounts are immediately purged via `adminAuth.deleteUser(uid)`.
3. **Database Rules (`firestore.rules`)**: Granular security rules require `request.auth.token.email.matches('.*@hbplus[.]fit$')` and prevent privilege escalation.
4. **AuthGate Route Guard (`RootNavigator.jsx`)**: Enforces authentication state and prevents unauthorized cross-role view transitions.

---

## 📱 Design System & Colour Palette

| Persona | Primary Gradient | Background | Surface | Accent |
| :--- | :--- | :--- | :--- | :--- |
| **User Workspace** | `#0F766E` → `#14B8A6` (Teal-Emerald) | `#F0FDFA` (Soft Mint) | `#FFFFFF` (Pure White) | `#10B981` (Success Green) |
| **Admin Control** | `#C2410C` → `#F97316` (Warm Coral-Orange) | `#FFF7ED` (Cream-Peach) | `#FFFFFF` (Pure White) | `#FF7A1A` (Vibrant Amber) |
| **Dark Accents** | `#0F172A` (Slate 900) | `#1E293B` (Slate 800) | `#334155` (Slate 700) | `#64748B` (Slate 500) |

- **Typography:** Inter / Plus Jakarta Sans with refined optical hierarchy and letter tracking.
- **Micro-Interactions:** 200ms spring animations, gentle input focus rings with 14px radius, and haptic-feel feedback.
- **Country Flags:** Crisp vector SVGs with 3-character ISO and dialing code search.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (Node 20+ LTS recommended)
- **Java 17 or 21** (Required for Android APK Gradle compilation)
- **Android SDK** configured with `ANDROID_HOME` in environment variables

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/vishalkhadatare/rivalry.git
cd rivalry
npm install
```

### 2. Configure Environment Variables
Create `.env` inside `apps/server/` and `apps/client/`:
```env
# Server (.env)
PORT=5000
ALLOWED_DOMAIN=hbplus.fit
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Client (.env)
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### 3. Launch Development Servers
```bash
# Terminal 1: Start Express API Backend (Port 5000)
npm run dev:server

# Terminal 2: Start Vite Client (Port 8081)
npm run dev:client
```
Visit **[http://localhost:8081](http://localhost:8081)** to preview in your browser.

---

## 🛠️ Provisioning Administrator Accounts

Admin accounts cannot be self-registered through the public UI. Use the secure CLI provisioning tool:

```bash
ADMIN_EMAIL="admin@hbplus.fit" ADMIN_PASSWORD="SecurePassword123!" node scripts/create-admin.js
```
The script:
1. Validates the email against the strict `@hbplus.fit` domain policy.
2. Creates the administrator in Firebase Authentication.
3. Cryptographically attaches the `{ role: 'admin' }` custom claim.
4. Initializes the `users/{uid}` record in Cloud Firestore.
5. Emits an immutable log in `auditLogs/{id}`.

---

## 📦 Building the Android APK

HB Plus features a zero-dependency build automation script that builds client production assets, syncs Capacitor plugins, and triggers the Gradle toolchain:

```bash
# Windows
.\build-apk.bat

# Or via npm scripts
npm run build:client
cd apps/client/android && gradlew.bat assembleDebug
```

The completed, installable deliverable is output to:
```
D:\Rivarly\HBPlus-Access.apk (~4.6 MB)
```

---

## 🧪 Running the Test Suite

Execute the full automated test suite covering domain validation, RBAC middleware, responsive tokens, and flag mappings:

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
Time:        3.15 s
```

---

## 📄 License & Attributions
- **License:** Licensed under the [MIT License](LICENSE).
- **Icons & Assets:** Vector graphics and SVG iconography adapted from Lucide & Phosphor under MIT. See [ATTRIBUTIONS.md](ATTRIBUTIONS.md).

<div align="center">
  <sub>Engineered with precision for executive enterprise operations. © HB Plus.</sub>
</div>