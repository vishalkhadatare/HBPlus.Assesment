import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleAuth } from 'google-auth-library';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rulesPath = path.resolve(__dirname, '../../../../firebase/firestore.rules');
const keyPath = path.resolve(__dirname, '../../../../serviceAccountKey.json');

const rulesContent = fs.readFileSync(rulesPath, 'utf8');

const auth = new GoogleAuth({
  keyFile: keyPath,
  scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/firebase']
});

async function deploy() {
  const client = await auth.getClient();
  console.log('Deploying rules from:', rulesPath);
  
  // 1. Create new ruleset
  const createRes = await client.request({
    url: 'https://firebaserules.googleapis.com/v1/projects/hbplus-rivalry-20261122/rulesets',
    method: 'POST',
    data: {
      source: {
        files: [
          {
            name: 'firestore.rules',
            content: rulesContent
          }
        ]
      }
    }
  });
  console.log('Created ruleset:', createRes.data.name);

  // 2. Release it to cloud.firestore
  const releaseRes = await client.request({
    url: 'https://firebaserules.googleapis.com/v1/projects/hbplus-rivalry-20261122/releases/cloud.firestore',
    method: 'PATCH',
    data: {
      release: {
        name: 'projects/hbplus-rivalry-20261122/releases/cloud.firestore',
        rulesetName: createRes.data.name
      }
    }
  });
  console.log('Successfully released to cloud.firestore:', releaseRes.data.name);
}

deploy().catch(err => {
  console.error('Deployment error:', err.response?.data || err.message);
  process.exit(1);
});
