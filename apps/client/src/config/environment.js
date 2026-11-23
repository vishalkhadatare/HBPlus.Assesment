/**
 * Client Environment Configuration
 * Safe for both Web (Vite / Webpack) and Native (Metro / Expo / Capacitor).
 */

const getEnv = (key, fallback = '') => {
  // Vite env
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  // Expo / React Native / Node env
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) return process.env[key];
    const expoKey = key.replace('VITE_', 'EXPO_PUBLIC_');
    if (process.env[expoKey]) return process.env[expoKey];
  }
  return fallback;
};

export const config = {
  // REST API Base URL
  API_BASE_URL: getEnv('VITE_API_BASE_URL', getEnv('EXPO_PUBLIC_API_BASE_URL', 'http://localhost:5000/api')),

  // Allowed Domain
  ALLOWED_EMAIL_DOMAIN: getEnv('VITE_ALLOWED_EMAIL_DOMAIN', getEnv('EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN', 'hbplus.fit')),

  // Firebase Client SDK Settings (Points directly to live Cloud Firestore project)
  firebase: {
    apiKey: getEnv('VITE_FIREBASE_API_KEY', getEnv('EXPO_PUBLIC_FIREBASE_API_KEY', 'AIzaSyDBpiydAHXbyfClkfjMqvePoqrS9vM17X8')),
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN', getEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 'hbplus-rivalry-20261122.firebaseapp.com')),
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID', getEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID', 'hbplus-rivalry-20261122')),
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET', getEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', 'hbplus-rivalry-20261122.firebasestorage.app')),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', getEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', '64669850819')),
    appId: getEnv('VITE_FIREBASE_APP_ID', getEnv('EXPO_PUBLIC_FIREBASE_APP_ID', '1:64669850819:web:40dd8789175ae794501676'))
  }
};

export default config;
