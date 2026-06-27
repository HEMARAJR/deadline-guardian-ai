// lib/db.ts
// Firestore CRUD helpers for Deadline Guardian

import { db, COLLECTIONS } from "./firebase";

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { Task, RescuePlan, FutureSimulation, VoiceLog, Analytics, User } from "@/types";

// ============================================================
// USERS
// ============================================================
export async function createOrUpdateUser(user: User): Promise<void> {
  const ref = doc(db, COLLECTIONS.USERS, user.uid);
  await setDoc(
    ref,
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      updatedAt: serverTimestamp(),
      stats: {
        totalTasks: 0,
        completedTasks: 0,
        rescuedTasks: 0,
        currentStreak: 0,
        totalXP: 0,
        level: 1,
      },
    },
    { merge: true }
  );
}

export async function getUser(uid: string): Promise<User | null> {
  const ref = doc(db, COLLECTIONS.USERS, uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as User) : null;
}

// ============================================================
// TASKS
// ============================================================
export async function createTask(task: Omit<Task, "id">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.TASKS), {
    ...task,
    deadline: Timestamp.fromDate(
      task.deadline instanceof Date
        ? task.deadline
        : new Date(task.deadline)
    ),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserTasks(userId: string): Promise<Task[]> {
  const q = query(
    collection(db, COLLECTIONS.TASKS),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      deadline: data.deadline?.toDate ? data.deadline.toDate() : new Date(data.deadline),
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
    } as Task;
  });
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
  const ref = doc(db, COLLECTIONS.TASKS, taskId);
  const payload: Record<string, unknown> = { ...updates, updatedAt: serverTimestamp() };
  if (updates.deadline) {
    payload.deadline = Timestamp.fromDate(
      updates.deadline instanceof Date
        ? updates.deadline
        : new Date(updates.deadline)
    );
  }
  await updateDoc(ref, payload);
}

export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.TASKS, taskId));
}

// ============================================================
// RESCUE PLANS
// ============================================================
export async function saveRescuePlan(plan: Omit<RescuePlan, "id">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.RESCUE_PLANS), {
    ...plan,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserRescuePlans(userId: string): Promise<RescuePlan[]> {
  const q = query(
    collection(db, COLLECTIONS.RESCUE_PLANS),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    } as RescuePlan;
  });
}

// ============================================================
// FUTURE SIMULATIONS
// ============================================================
export async function saveSimulation(sim: Omit<FutureSimulation, "id">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.SIMULATIONS), {
    ...sim,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserSimulations(userId: string): Promise<FutureSimulation[]> {
  const q = query(
    collection(db, COLLECTIONS.SIMULATIONS),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    } as FutureSimulation;
  });
}

// ============================================================
// VOICE LOGS
// ============================================================
export async function saveVoiceLog(log: Omit<VoiceLog, "id">): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTIONS.VOICE_LOGS), {
    ...log,
    timestamp: serverTimestamp(),
  });
  return ref.id;
}

// ============================================================
// ANALYTICS
// ============================================================
export async function updateAnalytics(
  userId: string,
  updates: Partial<Analytics>
): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const ref = doc(db, COLLECTIONS.ANALYTICS, `${userId}_${today}`);
  await setDoc(
    ref,
    {
      userId,
      date: today,
      ...updates,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserAnalytics(userId: string): Promise<Analytics[]> {
  const q = query(
    collection(db, COLLECTIONS.ANALYTICS),
    where("userId", "==", userId),
    orderBy("date", "desc"),
    limit(30)
  );
  const snap = await getDocs(q);
  return snap.docs.map(
    (d) => ({ ...d.data(), id: d.id }) as unknown as Analytics
  );
}
