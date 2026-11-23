#!/usr/bin/env node
/**
 * Secure One-Time Admin Creation Script (HBPlus)
 * 
 * Creates or promotes an administrator account strictly within the @hbplus.fit domain.
 * Sets the Firebase Auth custom claim { role: 'admin' } and writes the profile to Cloud Firestore.
 * 
 * Usage:
 *   ADMIN_EMAIL="admin@hbplus.fit" ADMIN_PASSWORD="SecurePassword123!" node scripts/create-admin.js
 * 
 * Or run interactively (prompts securely for credentials).
 */
import readline from 'readline';
import { adminAuth, adminDb } from '../apps/server/src/config/firebaseAdmin.js';
import { isAllowedEmail } from '../apps/server/src/utils/domainValidator.js';

async function prompt(question, isSecret = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function createAdmin() {
  console.log('========================================================');
  console.log('   HBPlus Secure Admin Provisioning Tool                ');
  console.log('========================================================\n');

  if (!adminAuth || !adminDb) {
    console.error('❌ Error: Firebase Admin SDK is not initialized. Ensure serviceAccountKey.json is present.');
    process.exit(1);
  }

  let email = process.env.ADMIN_EMAIL;
  let password = process.env.ADMIN_PASSWORD;
  let displayName = process.env.ADMIN_NAME || 'Official Administrator';

  if (!email) {
    email = await prompt('Enter Admin Email (@hbplus.fit): ');
  }

  // 1. Strict Domain Validation
  if (!isAllowedEmail(email)) {
    console.error(`\n❌ Error: Domain restriction failed! Only official @hbplus.fit addresses are allowed.`);
    process.exit(1);
  }

  if (!password) {
    password = await prompt('Enter Admin Password (minimum 8 characters): ', true);
  }

  if (!password || password.length < 8) {
    console.error('\n❌ Error: Password must be at least 8 characters long.');
    process.exit(1);
  }

  console.log(`\n⏳ Provisioning admin account for ${email}...`);

  try {
    let firebaseUser;
    let isNewUser = false;

    try {
      firebaseUser = await adminAuth.getUserByEmail(email);
      console.log(`ℹ️ User account already exists in Firebase Auth (UID: ${firebaseUser.uid}). Updating to Admin...`);
      // Update password and mark verified
      await adminAuth.updateUser(firebaseUser.uid, {
        password,
        emailVerified: true
      });
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        firebaseUser = await adminAuth.createUser({
          email,
          password,
          displayName,
          emailVerified: true
        });
        isNewUser = true;
        console.log(`✅ Created new user in Firebase Auth (UID: ${firebaseUser.uid}).`);
      } else {
        throw err;
      }
    }

    // 2. Set Custom User Claims for Server & Rules Authorization
    console.log(`🔐 Assigning cryptographic custom claim: { role: 'admin' }...`);
    await adminAuth.setCustomUserClaims(firebaseUser.uid, {
      role: 'admin',
      admin: true
    });

    // 3. Write user document into Cloud Firestore
    const userDocRef = adminDb.collection('users').doc(firebaseUser.uid);
    const now = new Date().toISOString();

    const adminProfile = {
      uid: firebaseUser.uid,
      email,
      displayName,
      role: 'admin',
      isActive: true,
      lastLogin: now,
      updatedAt: now
    };

    if (isNewUser) {
      adminProfile.createdAt = now;
    }

    await userDocRef.set(adminProfile, { merge: true });
    console.log(`📄 Cloud Firestore document synchronized: users/${firebaseUser.uid}`);

    // 4. Log to immutable auditLogs
    const auditRef = adminDb.collection('auditLogs').doc();
    await auditRef.set({
      id: auditRef.id,
      action: 'ADMIN_PROVISIONED',
      targetUid: firebaseUser.uid,
      targetEmail: email,
      performedBy: 'CLI_PROVISION_SCRIPT',
      timestamp: now,
      details: 'Administrator credentials and claims provisioned securely.'
    });
    console.log(`🛡️ Audit log recorded: auditLogs/${auditRef.id}`);

    console.log('\n========================================================');
    console.log('🎉 SUCCESS: Admin account successfully provisioned!');
    console.log(`   Email: ${email}`);
    console.log(`   Role:  admin`);
    console.log('   Login: Navigate to /login/admin to sign in.');
    console.log('========================================================\n');
  } catch (error) {
    console.error('\n❌ Provisioning failed:', error.message);
    process.exit(1);
  }
}

createAdmin();
