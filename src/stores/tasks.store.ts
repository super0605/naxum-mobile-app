import { create } from 'zustand';
import { Task } from '../domain/types';
import * as api from '../services/api/endpoints';

type TasksState = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refresh: (params?: { status?: 'OPEN' | 'COMPLETED'; assignedToUserId?: string }) => Promise<void>;
  create: (payload: { assignedToUserId: string; title: string; description?: string }) => Promise<void>;
  complete: (taskId: string) => Promise<void>;
};

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  async refresh(params) {
    set({ loading: true, error: null });
    try {
      const res = await api.listTasks(params);
      set({ tasks: res.tasks, loading: false });
    } catch {
      set({ error: 'Failed to load tasks', loading: false });
    }
  },

  async create(payload) {
    try {
      const res = await api.createTask(payload);
      set({ tasks: [res.task, ...get().tasks] });
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const message = error?.response?.data?.message || 'A task with the same title already exists for this user';
        throw new Error(message);
      }
      throw error;
    }
  },

  async complete(taskId) {
    const res = await api.completeTask(taskId);
    set({ tasks: get().tasks.map((t) => (t.id === taskId ? { ...t, ...res.task } : t)) });
  },
}));
