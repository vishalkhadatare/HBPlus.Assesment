import { adminAuth } from '../config/firebaseAdmin.js';
import { isAllowedEmailDomain } from '../utils/domainValidator.js';
import { errorResponse } from '../utils/apiResponse.js';
import { UserService } from '../services/userService.js';
import config from '../config/environment.js';

/**
 * Authentication Middleware
 * 
 * Verifies Firebase ID Token, enforces exact company email domain restriction,
 * provisions or fetches user profile from Firestore, and verifies active account status.
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json(
        errorResponse('Authorization header missing. Expected format: Bearer <token>', 'MISSING_TOKEN')
      );
    }

    const parts = authHeader.trim().split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return res.status(401).json(
        errorResponse('Invalid authorization header format. Expected Bearer scheme.', 'INVALID_AUTH_SCHEME')
      );
    }

    const idToken = parts[1];
    if (!idToken) {
      return res.status(401).json(
        errorResponse('Authentication token is empty.', 'EMPTY_TOKEN')
      );
    }

    // Cryptographic verification with Firebase Admin SDK
    let decodedToken;
    try {
      if (config.isTest && idToken.startsWith('mock-token-')) {
        // Safe mock token decoding strictly restricted to automated test runs
        const parsed = JSON.parse(Buffer.from(idToken.replace('mock-token-', ''), 'base64').toString());
        decodedToken = parsed;
      } else if (adminAuth) {
        // Check revocation parameter set to true for high-security enforcement
        decodedToken = await adminAuth.verifyIdToken(idToken, true);
      } else {
        throw new Error('Firebase Admin Auth service is uninitialized.');
      }
    } catch (verifyError) {
      if (verifyError.code === 'auth/id-token-expired') {
        return res.status(401).json(
          errorResponse('Authentication token has expired. Please sign in again.', 'TOKEN_EXPIRED')
        );
      }
      if (verifyError.code === 'auth/id-token-revoked') {
        return res.status(401).json(
          errorResponse('Authentication token has been revoked. Please sign in again.', 'TOKEN_REVOKED')
        );
      }
      return res.status(401).json(
        errorResponse('Invalid or unverifiable authentication token.', 'INVALID_TOKEN')
      );
    }

    // 1. Email presence check
    const email = decodedToken.email;
    if (!email || typeof email !== 'string') {
      return res.status(400).json(
        errorResponse('Authenticated account does not have an associated email address.', 'MISSING_EMAIL')
      );
    }

    // 2. Email verification check
    // Google OAuth accounts are usually email_verified = true
    if (decodedToken.email_verified === false) {
      return res.status(403).json(
        errorResponse('Email address is not verified by Google.', 'EMAIL_NOT_VERIFIED')
      );
    }

    // 3. Strict Server-Side Email Domain Restriction
    const isAllowed = isAllowedEmailDomain(email, config.ALLOWED_EMAIL_DOMAIN);
    if (!isAllowed) {
      return res.status(403).json(
        errorResponse('Access restricted. Please login using your official domain email.', 'DOMAIN_NOT_ALLOWED')
      );
    }

    // 4. Firestore profile lookup & provisioning
    let userProfile;
    try {
      userProfile = await UserService.provisionOrUpdateUser(decodedToken);
    } catch (profileError) {
      if (profileError.code === 'ACCOUNT_DISABLED') {
        return res.status(403).json(
          errorResponse('Access denied. Your account is deactivated.', 'ACCOUNT_DISABLED')
        );
      }
      throw profileError;
    }

    // 5. Account active status check
    if (userProfile.isActive === false) {
      return res.status(403).json(
        errorResponse('Access denied. Your account has been deactivated.', 'ACCOUNT_DISABLED')
      );
    }

    // 6. Attach trusted identity to request
    req.user = {
      uid: decodedToken.uid,
      email: userProfile.email,
      displayName: userProfile.displayName,
      photoURL: userProfile.photoURL,
      role: userProfile.role || 'user',
      isActive: userProfile.isActive,
      token: decodedToken
    };

    return next();
  } catch (error) {
    console.error('[Authentication Middleware Error]:', error.message);
    return res.status(500).json(
      errorResponse('Internal server error during authentication verification.', 'AUTH_INTERNAL_ERROR')
    );
  }
}

export default authenticate;
