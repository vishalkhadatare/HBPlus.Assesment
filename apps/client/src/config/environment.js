/**
 * Client Environment Configuration
 * Safe for both Web (Vite / Webpack) and Native (Metro / Expo).
 * 
 * Note: Mobile and web applications cannot securely hide client configuration keys.
 * Firebase client keys are identifiers, not privileged administrative secrets.
 * Actual application security is enforced server-side.
 */

// Helper to safely read env variables across Vite, Webpack, and React Native Metro
const getEnv = (key, fallback = '') => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

export const config = {
  // REST API Base URL
  // On Android emulator, use http://10.0.2.2:5000/api; on iOS simulator or web use http://localhost:5000/api
  API_BASE_URL: getEnv('VITE_API_BASE_URL', getEnv('API_BASE_URL', 'http://localhost:5000/api')),

  // Allowed Domain
  ALLOWED_EMAIL_DOMAIN: getEnv('VITE_ALLOWED_EMAIL_DOMAIN', getEnv('ALLOWED_EMAIL_DOMAIN', 'hbplus.fit')),

  // Firebase Client SDK Settings
  firebase: {
    apiKey: getEnv('VITE_FIREBASE_API_KEY', getEnv('FIREBASE_API_KEY', 'AIzaSyDemoDummyApiKeyForHBPlusSecureAccess001')),
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN', getEnv('FIREBASE_AUTH_DOMAIN', 'hbplus-secure-access.firebaseapp.com')),
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID', getEnv('FIREBASE_PROJECT_ID', 'hbplus-secure-access')),
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET', getEnv('FIREBASE_STORAGE_BUCKET', 'hbplus-secure-access.appspot.com')),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', getEnv('FIREBASE_MESSAGING_SENDER_ID', '123456789012')),
    appId: getEnv('VITE_FIREBASE_APP_ID', getEnv('FIREBASE_APP_ID', '1:123456789012:web:abcdef1234567890'))
  }
};

export default config;
