# HBPlus Secure Access Portal - REST API Specification

## Overview
The HBPlus Secure Access API provides an enterprise-grade authentication and authorization gateway.
Every protected route requires a cryptographically verified Firebase ID token passed in the HTTP `Authorization` header using the `Bearer` scheme.

```http
Authorization: Bearer <Firebase_ID_Token>
```

---

## Base URLs
- **Local Web / iOS Simulator**: `http://localhost:5000/api`
- **Android Emulator**: `http://10.0.2.2:5000/api`
- **Production**: `https://api.hbplus.fit/api`

---

## Standard Response Envelopes

### Success Response
```json
{
  "success": true,
  "message": "Human readable status message",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description message",
  "code": "MACHINE_READABLE_ERROR_CODE"
}
```

---

## Domain Restriction Policy

When a user authenticates with an unauthorized email address (e.g., `employee@gmail.com` or `employee@hbplus.fit.example.com`), the backend rejects the request with HTTP **403 Forbidden** and the following exact response payload:

```json
{
  "success": false,
  "message": "Access restricted. Please login using your official domain email.",
  "code": "DOMAIN_NOT_ALLOWED"
}
```

---

## Endpoints

### 1. Health Check
- **Route**: `GET /api/health`
- **Access**: Public
- **Description**: Returns the server operational status, uptime, and active enforced domain.

#### Response (200 OK):
```json
{
  "success": true,
  "message": "HBPlus Secure Access API is operational",
  "data": {
    "status": "UP",
    "uptime": 128.45,
    "timestamp": "2026-11-22T11:00:00.000Z",
    "environment": "development",
    "enforcedDomain": "hbplus.fit"
  }
}
```

---

### 2. Authentication Verification & Provisioning
- **Route**: `POST /api/auth/verify`
- **Access**: Authenticated (Bearer Token required)
- **Rate Limit**: 50 requests per 15 minutes per IP
- **Description**: Verifies the Firebase ID token cryptographically, validates that the email matches `@hbplus.fit` exactly, checks email verification status, provisions or updates the user profile in Cloud Firestore, and resolves the trusted role.

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "uid": "verified-firebase-user-id",
    "email": "employee@hbplus.fit",
    "displayName": "Jane Doe",
    "photoURL": "https://lh3.googleusercontent.com/...",
    "role": "user",
    "isActive": true,
    "domain": "hbplus.fit",
    "authorizedAt": "2026-11-22T11:00:00.000Z"
  }
}
```

#### Rejection (403 Forbidden - Unauthorized Domain):
```json
{
  "success": false,
  "message": "Access restricted. Please login using your official domain email.",
  "code": "DOMAIN_NOT_ALLOWED"
}
```

---

### 3. Current Authenticated Profile
- **Route**: `GET /api/auth/me`
- **Access**: Authenticated (Bearer Token required)
- **Description**: Returns the active authorization profile for the verified caller.

#### Response (200 OK):
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "uid": "verified-firebase-user-id",
    "email": "employee@hbplus.fit",
    "displayName": "Jane Doe",
    "photoURL": "https://lh3.googleusercontent.com/...",
    "role": "user",
    "isActive": true,
    "domain": "hbplus.fit",
    "authorizedAt": "2026-11-22T11:00:00.000Z"
  }
}
```

---

### 4. Protected Corporate Dashboard
- **Route**: `GET /api/dashboard`
- **Access**: Authenticated (`user` or `admin`)
- **Description**: Returns customized operational metrics, portal configuration overview, and authorized corporate resource links.

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "portalOverview": {
      "organizationName": "HBPlus Fitness & Health International",
      "enforcedDomain": "hbplus.fit",
      "portalVersion": "2.4.0",
      "systemStatus": "Operational",
      "securityStatus": "Enforced (Domain Restricted & Multi-Factor Guarded)",
      "serverTime": "2026-11-22T11:00:00.000Z"
    },
    "userSummary": {
      "uid": "verified-firebase-user-id",
      "email": "employee@hbplus.fit",
      "displayName": "Jane Doe",
      "role": "user",
      "lastLogin": "2026-11-22T11:00:00.000Z",
      "authorizedDomain": "hbplus.fit"
    },
    "metrics": [
      { "id": "membership-tier", "label": "Access Tier", "value": "Corporate Staff", "change": "Verified" },
      { "id": "locations-access", "label": "Facility Access", "value": "All Locations", "change": "Unlimited" },
      { "id": "wellness-credits", "label": "Wellness Credits", "value": "$1,200 / yr", "change": "Active" },
      { "id": "security-compliance", "label": "Domain Validation", "value": "Compliant", "change": "hbplus.fit" }
    ],
    "corporateResources": [
      { "id": "res-1", "title": "Internal Directory & Staff Portal", "category": "HR & Directory", "status": "Available" },
      { "id": "res-2", "title": "HBPlus Gym & Studio Booking Pass", "category": "Facilities", "status": "Active" },
      { "id": "res-3", "title": "Corporate Health & Nutrition Dashboard", "category": "Health & Perks", "status": "Connected" },
      { "id": "res-4", "title": "IT Security & Single Sign-On Helpdesk", "category": "Support", "status": "Online" }
    ]
  }
}
```

---

### 5. User Profile (Firestore Document)
- **Route**: `GET /api/users/me`
- **Access**: Authenticated
- **Description**: Retrieves current user's profile from Cloud Firestore. Access to other users' documents is strictly prevented.

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "uid": "verified-firebase-user-id",
    "email": "employee@hbplus.fit",
    "displayName": "Jane Doe",
    "photoURL": "https://lh3.googleusercontent.com/...",
    "role": "user",
    "isActive": true,
    "createdAt": "2026-11-22T11:00:00.000Z",
    "lastLoginAt": "2026-11-22T11:00:00.000Z"
  }
}
```

---

### 6. Safe Profile Update
- **Route**: `PATCH /api/users/me`
- **Access**: Authenticated
- **Description**: Updates safe non-sensitive attributes (`displayName`, `photoURL`). Attempting to modify `role` or `isActive` status is ignored to prevent privilege escalation.

#### Request Body:
```json
{
  "displayName": "Jane Elizabeth Doe",
  "photoURL": "https://example.com/avatar.jpg"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

---

### 7. Admin-Only Corporate User Directory
- **Route**: `GET /api/admin/users`
- **Access**: Authenticated & Role: `admin` only
- **Description**: Lists all provisioned corporate users in Cloud Firestore. Ordinary users (`role: user`) receive 403 Forbidden.

#### Response (200 OK - Admin):
```json
{
  "success": true,
  "message": "User directory retrieved successfully",
  "data": {
    "total": 24,
    "users": [
      {
        "uid": "admin-1",
        "email": "admin@hbplus.fit",
        "displayName": "System Admin",
        "role": "admin",
        "isActive": true
      }
    ]
  }
}
```

#### Rejection (403 Forbidden - Non-Admin):
```json
{
  "success": false,
  "message": "Forbidden: You do not have permission to perform this action.",
  "code": "FORBIDDEN"
}
```
