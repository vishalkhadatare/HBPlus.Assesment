import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getApps } from 'firebase/app';
import { Platform } from 'react-native';
import { auth, db } from '../config/firebase.js';
import config from '../config/environment.js';

/**
 * Runs comprehensive live diagnostic suite for Firebase Auth & Firestore connectivity.
 */
export async function runFirebaseDiagnostics(currentUser = null) {
  const results = [];
  const user = currentUser || auth.currentUser;

  // 1. CONFIG CHECK
  try {
    const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missing = requiredKeys.filter((k) => !config.firebase[k]);
    if (missing.length === 0) {
      results.push({
        id: 'config',
        name: 'Config Check',
        status: 'PASS',
        message: `Project: ${config.firebase.projectId} (All 6 Firebase keys loaded)`
      });
    } else {
      results.push({
        id: 'config',
        name: 'Config Check',
        status: 'FAIL',
        message: `Missing keys: ${missing.join(', ')}`
      });
    }
  } catch (err) {
    results.push({ id: 'config', name: 'Config Check', status: 'FAIL', message: err.message });
  }

  // 2. INIT CHECK
  try {
    const appCount = getApps().length;
    if (appCount === 1) {
      results.push({
        id: 'init',
        name: 'Init Check',
        status: 'PASS',
        message: 'Single Firebase app initialized; Firestore active (database: (default))'
      });
    } else {
      results.push({
        id: 'init',
        name: 'Init Check',
        status: 'WARN',
        message: `Detected ${appCount} initialized Firebase apps.`
      });
    }
  } catch (err) {
    results.push({ id: 'init', name: 'Init Check', status: 'FAIL', message: err.message });
  }

  // 3. AUTH CHECK
  let idToken = null;
  const uid = user?.uid || 'guest-diagnostic-test';
  try {
    if (user) {
      idToken = await user.getIdToken(true);
      const email = user.email || '';
      const isDomainOk = email.toLowerCase().endsWith('@hbplus.fit');
      results.push({
        id: 'auth',
        name: 'Auth Check',
        status: 'PASS',
        message: `UID: ${user.uid.slice(0, 8)}... | Email: ${email} (${isDomainOk ? '@hbplus.fit verified' : 'External'}) | Token fetched`
      });
    } else {
      results.push({
        id: 'auth',
        name: 'Auth Check',
        status: 'WARN',
        message: 'No user signed in. Running unauthenticated test suite.'
      });
    }
  } catch (err) {
    results.push({
      id: 'auth',
      name: 'Auth Check',
      status: 'FAIL',
      message: `Token fetch error: [${err.code || 'unknown'}] ${err.message}`
    });
  }

  // 4. FIRESTORE WRITE TEST
  try {
    const diagRef = doc(db, 'diagnostics', uid);
    const startWrite = Date.now();
    await setDoc(diagRef, {
      uid,
      email: user?.email || 'guest@hbplus.fit',
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
      serverTs: serverTimestamp()
    });
    const writeMs = Date.now() - startWrite;
    results.push({
      id: 'firestore_write',
      name: 'Firestore Write Test',
      status: 'PASS',
      message: `Document written to diagnostics/${uid} in ${writeMs}ms`
    });
  } catch (err) {
    results.push({
      id: 'firestore_write',
      name: 'Firestore Write Test',
      status: 'FAIL',
      code: err.code || 'unknown',
      message: `Error [${err.code || 'unknown'}]: ${err.message}`
    });
  }

  // 5. FIRESTORE READ-BACK TEST
  try {
    const diagRef = doc(db, 'diagnostics', uid);
    const startRead = Date.now();
    const snap = await getDoc(diagRef);
    const readMs = Date.now() - startRead;
    if (snap.exists()) {
      results.push({
        id: 'firestore_read',
        name: 'Firestore Read-Back Test',
        status: 'PASS',
        message: `Successfully read diagnostics/${uid} in ${readMs}ms (platform: ${snap.data().platform || 'unknown'})`
      });
    } else {
      results.push({
        id: 'firestore_read',
        name: 'Firestore Read-Back Test',
        status: 'FAIL',
        message: `Document diagnostics/${uid} not found after write.`
      });
    }
  } catch (err) {
    results.push({
      id: 'firestore_read',
      name: 'Firestore Read-Back Test',
      status: 'FAIL',
      code: err.code || 'unknown',
      message: `Error [${err.code || 'unknown'}]: ${err.message}`
    });
  }

  // 6. REST API TEST
  if (idToken) {
    try {
      const restUrl = `https://firestore.googleapis.com/v1/projects/${config.firebase.projectId}/databases/(default)/documents/diagnostics/${uid}`;
      const res = await fetch(restUrl, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        results.push({
          id: 'rest_api',
          name: 'Firestore REST API Test',
          status: 'PASS',
          message: `HTTP ${res.status} OK directly via firestore.googleapis.com`
        });
      } else {
        results.push({
          id: 'rest_api',
          name: 'Firestore REST API Test',
          status: 'FAIL',
          message: `HTTP ${res.status}: ${data.error?.message || 'REST endpoint error'}`
        });
      }
    } catch (err) {
      results.push({
        id: 'rest_api',
        name: 'Firestore REST API Test',
        status: 'FAIL',
        message: `Network error reaching Google REST API: ${err.message}`
      });
    }
  }

  // 7. NETWORK CHECK
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  results.push({
    id: 'network',
    name: 'Network Status Check',
    status: isOnline ? 'PASS' : 'FAIL',
    message: isOnline ? 'Client network connection active' : 'Offline: No network detected'
  });

  return results;
}
