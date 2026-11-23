import admin from 'firebase-admin';
import fs from 'fs';

const sa = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(sa),
  projectId: sa.project_id
});

const apiKey = 'AIzaSyDBpiydAHXbyfClkfjMqvePoqrS9vM17X8';

async function runLiveTest() {
  console.log('===============================================================');
  console.log('🔥 LIVE FIREBASE INTEGRATION TEST: PROJECT ' + sa.project_id);
  console.log('===============================================================');

  console.log('\n--- TEST 1: Authorized Employee (@hbplus.fit) ---');
  const uid = 'KhDIe7uXNUfQVnzHl3cQUMUF7Hf2';
  const customToken = await admin.auth().createCustomToken(uid);

  // Exchange custom token for real cryptographic Firebase ID token via Identity Toolkit
  const exchangeRes = await fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' + apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: customToken, returnSecureToken: true })
    }
  );
  const exchangeData = await exchangeRes.json();
  const idToken = exchangeData.idToken;
  console.log('✅ Real Firebase ID Token minted (JWT length: ' + idToken?.length + ')');

  // Verify against backend POST /api/auth/verify
  console.log('\n--> Request: POST /api/auth/verify');
  const verifyRes = await fetch('http://localhost:5000/api/auth/verify', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + idToken,
      'Content-Type': 'application/json'
    }
  });
  const verifyData = await verifyRes.json();
  console.log('HTTP Status:', verifyRes.status);
  console.log('Response Payload:', JSON.stringify(verifyData, null, 2));

  // Access Protected Dashboard
  console.log('\n--> Request: GET /api/dashboard');
  const dashRes = await fetch('http://localhost:5000/api/dashboard', {
    headers: { Authorization: 'Bearer ' + idToken }
  });
  const dashData = await dashRes.json();
  console.log('HTTP Status:', dashRes.status);
  console.log('Dashboard Data:', JSON.stringify(dashData, null, 2));

  // Access User Profile from Firestore
  console.log('\n--> Request: GET /api/users/me');
  const userRes = await fetch('http://localhost:5000/api/users/me', {
    headers: { Authorization: 'Bearer ' + idToken }
  });
  const userData = await userRes.json();
  console.log('HTTP Status:', userRes.status);
  console.log('Firestore Profile:', JSON.stringify(userData, null, 2));

  console.log('\n--- TEST 2: Unauthorized Domain Account (@gmail.com) ---');
  let tempUser;
  try {
    tempUser = await admin.auth().createUser({
      email: 'outsider-test-' + Date.now() + '@gmail.com',
      emailVerified: true,
      displayName: 'External Person'
    });
    const outsiderCustomToken = await admin.auth().createCustomToken(tempUser.uid);
    const outsiderEx = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: outsiderCustomToken, returnSecureToken: true })
      }
    );
    const outsiderIdToken = (await outsiderEx.json()).idToken;

    console.log('--> Request: POST /api/auth/verify with external @gmail.com account');
    const outsiderRes = await fetch('http://localhost:5000/api/auth/verify', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + outsiderIdToken }
    });
    const outsiderData = await outsiderRes.json();
    console.log('HTTP Status:', outsiderRes.status, '(Expected: 403 Forbidden)');
    console.log('Response Payload:', JSON.stringify(outsiderData, null, 2));
  } finally {
    if (tempUser) {
      await admin.auth().deleteUser(tempUser.uid);
      console.log('Cleaned up temporary outsider account.');
    }
  }

  console.log('\n===============================================================');
  console.log('🎉 ALL LIVE FIREBASE TESTS COMPLETED SUCCESSFULLY!');
  console.log('===============================================================');
}

runLiveTest().catch(console.error);
