import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDhfmzc0mV8eMAP-ds69HI0dcME9gYPD2A',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'streetvoice-217cb.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'streetvoice-217cb',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'streetvoice-217cb.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '926922118364',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:926922118364:web:bb63824f368bf8a9201019'
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

export const logoutFirebase = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Firebase signout error:', err);
  }
};

export default app;
