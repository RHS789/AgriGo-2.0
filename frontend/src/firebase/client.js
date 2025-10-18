import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

// Build firebase config from environment variables, only include values that are set
const rawConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

const firebaseConfig = Object.fromEntries(
  Object.entries(rawConfig).filter(([, v]) => v !== undefined && v !== null && v !== '')
);

// Initialize app with whatever config is available
const app = initializeApp(firebaseConfig);

let analytics = null;
(async () => {
  try {
    if (await isSupported()) analytics = getAnalytics(app);
  } catch (err) {
    // Analytics may not be supported in this environment; ignore silently
    // (e.g. SSR or missing measurementId)
    // eslint-disable-next-line no-console
    console.warn('Firebase analytics not initialized:', err && err.message ? err.message : err);
  }
})();

// Initialize Realtime Database only when we have enough config (databaseURL or projectId)
let db = null;
try {
  if (firebaseConfig.databaseURL || firebaseConfig.projectId) {
    db = getDatabase(app);
  }
} catch (err) {
  // If database cannot be initialized due to missing native config, log and continue
  // eslint-disable-next-line no-console
  console.warn('Firebase database not initialized:', err && err.message ? err.message : err);
}

export { app, analytics, db };
