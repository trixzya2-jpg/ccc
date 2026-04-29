import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Lazy initialization of Firebase services to prevent build-time errors
 * when the config file might not be fully resolved or present.
 */

async function getFirebaseConfig() {
  try {
    // @ts-ignore
    const config = await import('@/firebase-applet-config.json');
    return config.default || config;
  } catch (e) {
    console.warn('Firebase configuration not found. Please run set_up_firebase.');
    return null;
  }
}

export const getDB = async () => {
  const config = await getFirebaseConfig();
  if (!config) return null;
  
  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  return getFirestore(app, config.firestoreDatabaseId);
};

export const getAuthService = async () => {
  const config = await getFirebaseConfig();
  if (!config) return null;
  
  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  return getAuth(app);
};

