import dotenv from 'dotenv';

// Load .env file
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = parseInt(process.env.API_PORT || process.env.PORT || '5000', 10);
const ALLOWED_EMAIL_DOMAIN = (process.env.ALLOWED_EMAIL_DOMAIN || 'hbplus.fit').trim().toLowerCase();

// Allowed CORS origins (support comma-separated origins)
const rawClientOrigins = process.env.CLIENT_ORIGIN || 'http://localhost:8081,http://localhost:3000,http://localhost:5173';
const CLIENT_ORIGINS = rawClientOrigins.split(',').map((origin) => origin.trim()).filter(Boolean);

// Firebase Admin configuration
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || '';
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || '';
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : '';
const FIREBASE_SERVICE_ACCOUNT_KEY_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || '';

// Admin emails (comma-separated list of emails that receive Admin role upon registration/login)
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'admin@hbplus.fit')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Validates critical environment settings.
 */
export function validateEnvironment() {
  if (NODE_ENV === 'test') {
    return;
  }

  const warnings = [];
  if (!ALLOWED_EMAIL_DOMAIN) {
    throw new Error('FATAL CONFIGURATION ERROR: ALLOWED_EMAIL_DOMAIN must be defined.');
  }

  if (warnings.length > 0) {
    console.warn('[Environment Warnings]:\n' + warnings.map((w) => ` - ${w}`).join('\n'));
  }
}

export const config = {
  NODE_ENV,
  PORT,
  ALLOWED_EMAIL_DOMAIN,
  CLIENT_ORIGINS,
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_SERVICE_ACCOUNT_KEY_PATH,
  ADMIN_EMAILS,
  isProduction: NODE_ENV === 'production',
  isTest: NODE_ENV === 'test',
  isDevelopment: NODE_ENV === 'development'
};

export default config;
