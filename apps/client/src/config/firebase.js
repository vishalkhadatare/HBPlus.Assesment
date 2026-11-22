import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import config from './environment.js';

/**
 * Initializes and exports singleton Firebase client instance.
 * Avoids duplicate initialization across fast-refresh and hot-reloading.
 */
let app;
if (getApps().length === 0) {
  app = initializeApp(config.firebase);
} else {
  app = getApp();
}

// Export Authentication singleton
export const auth = getAuth(app);

export default app;
