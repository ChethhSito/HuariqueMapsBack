import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import * as path from 'path';

if (!getApps().length) {
  let serviceAccount;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (error) {
      console.error('Error parseando FIREBASE_SERVICE_ACCOUNT:', error);
      throw error;
    }
  } else {
    serviceAccount = require(path.join(process.cwd(), 'firebase-admin-key.json'));
  }

  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'huarique-map.firebasestorage.app'
  });
}

export const adminStorage = getStorage();
export default {};
