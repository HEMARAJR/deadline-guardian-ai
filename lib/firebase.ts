// ============================================================
// DEADLINE GUARDIAN AI — Firebase Configuration
// ============================================================
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'deadline-guardian-demo',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123:web:abc',
};

console.log("Firebase Config:", firebaseConfig);

// Prevent duplicate initialization in Next.js hot reloads
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ============================================================
// Firestore Collections
// ============================================================
export const COLLECTIONS = {
  USERS: 'users',
  TASKS: 'tasks',
  GOALS: 'goals',
  HABITS: 'habits',
  PREDICTIONS: 'predictions',
  RESCUE_PLANS: 'rescuePlans',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
  MEMORY: 'memory',
  TIMELINE: 'timeline',
  PLUGINS: 'plugins',

  // Missing collections
  SIMULATIONS: 'simulations',
  VOICE_LOGS: 'voiceLogs',
} as const;

export default app;