// ============================================================
// DEADLINE GUARDIAN AI — Firestore Operations
// ============================================================
import {
  collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, limit, addDoc, serverTimestamp, Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Task, RescuePlan, VoiceLog, Analytics } from '@/types';

// ─── USERS ───────────────────────────────────────────────────
export async function createOrUpdateUser(uid: string, data: Record<string, unknown>) {
  await setDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getUser(uid: string) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ─── TASKS ───────────────────────────────────────────────────
export async function createTask(task: Omit<Task, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'tasks'), {
    ...task,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getTasks(userId: string): Promise<Task[]> {
  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      deadline: data.deadline instanceof Timestamp ? data.deadline.toDate() : data.deadline,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
    } as Task;
  });
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  await updateDoc(doc(db, 'tasks', taskId), { ...updates, updatedAt: serverTimestamp() });
}

export async function deleteTask(taskId: string) {
  await deleteDoc(doc(db, 'tasks', taskId));
}

// ─── RESCUE PLANS ────────────────────────────────────────────
export async function saveRescuePlan(plan: Omit<RescuePlan, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'rescuePlans'), {
    ...plan,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getRescuePlans(userId: string): Promise<RescuePlan[]> {
  const q = query(
    collection(db, 'rescuePlans'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as RescuePlan));
}

// ─── VOICE LOGS ──────────────────────────────────────────────
export async function saveVoiceLog(log: Omit<VoiceLog, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'voiceLogs'), {
    ...log,
    timestamp: serverTimestamp(),
  });
  return ref.id;
}

export async function getVoiceLogs(userId: string): Promise<VoiceLog[]> {
  const q = query(
    collection(db, 'voiceLogs'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as VoiceLog));
}

// ─── ANALYTICS ───────────────────────────────────────────────
export async function updateAnalytics(userId: string, data: Partial<Analytics>) {
  await setDoc(doc(db, 'analytics', userId), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getAnalytics(userId: string): Promise<Analytics | null> {
  const snap = await getDoc(doc(db, 'analytics', userId));
  return snap.exists() ? { userId, ...snap.data() } as Analytics : null;
}
