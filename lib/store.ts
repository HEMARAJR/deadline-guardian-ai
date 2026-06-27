// ============================================================
// DEADLINE GUARDIAN AI — Zustand Store
// ============================================================
import { create } from 'zustand';
import type { Task, User, RescuePlan, ChatMessage } from '@/types';

interface AppState {
  user: User | null;
  tasks: Task[];
  rescuePlans: RescuePlan[];
  chatMessages: ChatMessage[];
  isListening: boolean;
  voiceTranscript: string;
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  setRescuePlans: (plans: RescuePlan[]) => void;
  addRescuePlan: (plan: RescuePlan) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  setIsListening: (v: boolean) => void;
  setVoiceTranscript: (t: string) => void;
  setSelectedTask: (task: Task | null) => void;
  setIsLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  tasks: [],
  rescuePlans: [],
  chatMessages: [],
  isListening: false,
  voiceTranscript: '',
  selectedTask: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
  updateTask: (id, updates) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
  removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  setRescuePlans: (plans) => set({ rescuePlans: plans }),
  addRescuePlan: (plan) => set((s) => ({ rescuePlans: [plan, ...s.rescuePlans] })),
  addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  clearChat: () => set({ chatMessages: [] }),
  setIsListening: (v) => set({ isListening: v }),
  setVoiceTranscript: (t) => set({ voiceTranscript: t }),
  setSelectedTask: (task) => set({ selectedTask: task }),
  setIsLoading: (v) => set({ isLoading: v }),
  setError: (e) => set({ error: e }),
}));
