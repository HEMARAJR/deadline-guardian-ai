// ============================================================
// DEADLINE GUARDIAN AI — Auth Hook
// ============================================================
'use client';
import { useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useStore } from '@/lib/store';
import { createOrUpdateUser } from '@/lib/firestore';
import type { User } from '@/types';

export function useAuth() {
  const { user, setUser } = useStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userData: User = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          createdAt: new Date(),
          xp: 0,
          level: 1,
          streak: 0,
        };
        setUser(userData);
        // Persist to Firestore
        try {
          await createOrUpdateUser(fbUser.uid, {
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
          });
        } catch (e) {
          console.warn('Could not sync user to Firestore:', e);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, [setUser]);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    await fbSignOut(auth);
    setUser(null);
  };

  return { user, signIn, signOut };
}
