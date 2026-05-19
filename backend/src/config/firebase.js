import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { config } from './env.js';

function initFirebase() {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  if (!config.firebaseServiceAccount) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY env var is not set');
  }

  const serviceAccount = JSON.parse(config.firebaseServiceAccount);

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

const firebaseApp = initFirebase();

export const auth = getAuth(firebaseApp);
