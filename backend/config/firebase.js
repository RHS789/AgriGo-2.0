const admin = require('firebase-admin');

// Firebase configuration - Using service account credentials
// For production, use environment variables instead
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyC...',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'agrigo-2-0.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'agrigo-2-0',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'agrigo-2-0.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.FIREBASE_APP_ID || '1:123456789:web:...'
};

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
    databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
  });
}

const firebaseDB = admin.database();

module.exports = { admin, firebaseDB, firebaseConfig };
