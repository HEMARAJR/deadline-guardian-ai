// ============================================================
// DEADLINE GUARDIAN AI — Tasks Hook
// ============================================================
'use client';
import { useCallback } from 'react';
import { useStore } from '@/lib/store';
import {
  createTask as fbCreateTask,
  getTasks,
  updateTask as fbUpdateTask,
  deleteTask as fbDeleteTask,
} from '@/lib/firestore';
import type { Task } from '@/types';

export function useTasks() {
  const { user, tasks, setTasks, addTask, updateTask, removeTask } = useStore();

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getTasks(user.uid);
      setTasks(data);
    } catch (e) {
      console.warn('Could not fetch tasks from Firestore:', e);
    }
  }, [user, setTasks]);

  const createTask = useCallback(async (taskData: Omit<Task, 'id'>) => {
    if (!user) return null;
    try {
      const id = await fbCreateTask(taskData);
      const newTask = { ...taskData, id };
      addTask(newTask);
      return newTask;
    } catch (e) {
      console.warn('Could not save task to Firestore:', e);
      // Still add locally
      const localTask = { ...taskData, id: `local_${Date.now()}` };
      addTask(localTask);
      return localTask;
    }
  }, [user, addTask]);

  const editTask = useCallback(async (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
    try {
      await fbUpdateTask(id, updates);
    } catch (e) {
      console.warn('Could not update task in Firestore:', e);
    }
  }, [updateTask]);

  const deleteTaskById = useCallback(async (id: string) => {
    removeTask(id);
    try {
      await fbDeleteTask(id);
    } catch (e) {
      console.warn('Could not delete task from Firestore:', e);
    }
  }, [removeTask]);

  const getHighRiskTasks = useCallback(() => {
    return tasks.filter(t => t.riskLevel === 'high' || t.riskLevel === 'critical');
  }, [tasks]);

  return { tasks, fetchTasks, createTask, editTask, deleteTaskById, getHighRiskTasks };
}
