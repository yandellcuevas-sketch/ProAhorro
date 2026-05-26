import { create } from 'zustand';
import type { Goal } from '../types';
import { goalsService } from '../services/goalsService';

interface GoalsState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;

  fetchGoals: (status?: Goal['status']) => Promise<void>;
  createGoal: (payload: Parameters<typeof goalsService.createGoal>[0]) => Promise<Goal>;
  updateGoal: (id: string, payload: Partial<Goal>) => Promise<void>;
  setGoalStatus: (id: string, status: Goal['status']) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  refreshGoal: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async (status) => {
    set({ isLoading: true, error: null });
    try {
      const goals = await goalsService.getGoals(status);
      set({ goals, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createGoal: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const goal = await goalsService.createGoal(payload);
      set((s) => ({ goals: [goal, ...s.goals], isLoading: false }));
      return goal;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateGoal: async (id, payload) => {
    try {
      const updated = await goalsService.updateGoal(id, payload);
      set((s) => ({
        goals: s.goals.map((g) => (g.id === id ? updated : g)),
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  setGoalStatus: async (id, status) => {
    await goalsService.setGoalStatus(id, status);
    set((s) => ({
      goals: s.goals.map((g) =>
        g.id === id ? { ...g, status } : g
      ),
    }));
  },

  deleteGoal: async (id) => {
    await goalsService.deleteGoal(id);
    set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
  },

  refreshGoal: async (id) => {
    const updated = await goalsService.getGoal(id);
    set((s) => ({
      goals: s.goals.map((g) => (g.id === id ? updated : g)),
    }));
  },

  clearError: () => set({ error: null }),
}));
