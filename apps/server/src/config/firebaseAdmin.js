import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import config from './environment.js';

let appInstance = null;

/**
 * Initializes and returns the Firebase Admin instance.
 * Supports:
 * 1. Explicit Service Account Key file (via FIREBASE_SERVICE_ACCOUNT_KEY_PATH)
 * 2. Environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
 * 3. Application Default Credentials (GOOGLE_APPLICATION_CREDENTIALS or Cloud environment)
 * 4. Local Emulator Suite if configured
 */
export function initFirebaseAdmin() {
  if (admin.apps.length > 0) {
    appInstance = admin.apps[0];
    return appInstance;
  }

  try {
    // 1. Service account JSON file path
    if (config.FIREBASE_SERVICE_ACCOUNT_KEY_PATH) {
      const resolvedPath = path.resolve(process.cwd(), config.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);
      if (fs.existsSync(resolvedPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
        appInstance = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id || config.FIREBASE_PROJECT_ID
        });
        console.log('[Firebase Admin] Initialized with service account file:', resolvedPath);
        return appInstance;
      }
    }

    // 2. Inline credentials from environment variables
    if (config.FIREBASE_PROJECT_ID && config.FIREBASE_CLIENT_EMAIL && config.FIREBASE_PRIVATE_KEY) {
      appInstance = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.FIREBASE_PROJECT_ID,
          clientEmail: config.FIREBASE_CLIENT_EMAIL,
          privateKey: config.FIREBASE_PRIVATE_KEY
        }),
        projectId: config.FIREBASE_PROJECT_ID
      });
      console.log('[Firebase Admin] Initialized with environment credentials for project:', config.FIREBASE_PROJECT_ID);
      return appInstance;
    }

    // 3. Application Default Credentials (e.g., in Google Cloud / Firebase Hosting / GOOGLE_APPLICATION_CREDENTIALS)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_CONFIG) {
      appInstance = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: config.FIREBASE_PROJECT_ID || undefined
      });
      console.log('[Firebase Admin] Initialized with Application Default Credentials');
      return appInstance;
    }

    // 4. In test or development without credentials, initialize with minimal config if emulators or tests are active
    if (config.isTest || config.isDevelopment) {
      appInstance = admin.initializeApp({
        projectId: config.FIREBASE_PROJECT_ID || 'hbplus-test-project'
      });
      console.warn('[Firebase Admin] Initialized with default projectId (no private key cert configured).');
      return appInstance;
    }

    throw new Error(
      'Missing Firebase Admin credentials. Please provide FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY, or set GOOGLE_APPLICATION_CREDENTIALS.'
    );
  } catch (error) {
    console.error('[Firebase Admin] Initialization failed:', error.message);
    if (!config.isTest) {
      throw error;
    }
  }
}

// Automatically initialize on import
initFirebaseAdmin();

export const adminAuth = admin.apps.length > 0 ? admin.auth() : null;
export const adminDb = admin.apps.length > 0 ? admin.firestore() : null;

export default admin;
