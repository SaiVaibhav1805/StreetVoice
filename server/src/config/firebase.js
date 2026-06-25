import admin from 'firebase-admin';

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    // Replace escaped newlines if present in environment variable
    privateKey = privateKey.replace(/\\n/g, '\n');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    console.warn('Firebase Admin SDK credentials not fully set. Initializing with default environment configuration.');
    admin.initializeApp();
  }
} catch (error) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase Admin SDK initialization error:', error);
  }
}

export const getFirebase = () => admin;
export default admin;