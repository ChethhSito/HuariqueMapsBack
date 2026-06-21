import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import * as path from 'path';

if (!getApps().length) {
  const serviceAccount = require(path.join(process.cwd(), 'firebase-admin-key.json'));

  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'huarique-map.firebasestorage.app'
  });
}

export const adminStorage = getStorage();
export default {};
