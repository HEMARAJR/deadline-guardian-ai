// ============================================================
// DEADLINE GUARDIAN AI — Firebase Configuration
// ============================================================
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA75V8eben1TTWKLZbe820jF9pLxL7xBw4",
  authDomain: "deadline-guardian-ai-demo.firebaseapp.com",
  projectId: "deadline-guardian-ai-demo",
  storageBucket: "deadline-guardian-ai-demo.firebasestorage.app",
  messagingSenderId: "8046651296",
  appId: "1:8046651296:web:3bff6f92e72dbccc2ae6c5",
};

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