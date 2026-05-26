import { create } from 'zustand';
import type { Saving } from '../types';
import { savingsService } from '../services/savingsService';
import { HISTORY_PAGE_SIZE } from '../constants';

interface SavingsState {
  savings: Saving[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  filters: {
    currency?: string;
    goal_id?: string;
    type?: 'free' | 'goal' | 'split';
    date_from?: string;
    date_to?: string;
  };

  fetchSavings: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  setFilter: (key: string, value: string | undefined) => void;
  clearFilters: () => void;
  deleteSaving: (id: string, goal_id?: string) => Promise<void>;
  clearError: () => void;
}

export const useSavingsStore = create<SavingsState>((set, get) => ({
  savings: [],
  page: 0,
  hasMore: false,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  filters: {},

  fetchSavings: async (reset = true) => {
    set({ isLoading: true, error: null });
    try {
      const { savings, hasMore } = await savingsService.getHistory({
        page: 0,
        ...get().filters,
      });
      set({ savings, hasMore, page: 0, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  loadMore: async () => {
    if (!get().hasMore || get().isLoadingMore) return;
    const nextPage = get().page + 1;
    set({ isLoadingMore: true });
    try {
      const { savings, hasMore } = await savingsService.getHistory({
        page: nextPage,
        ...get().filters,
      });
      set((s) => ({
        savings: [...s.savings, ...savings],
        hasMore,
        page: nextPage,
        isLoadingMore: false,
      }));
    } catch {
      set({ isLoadingMore: false });
    }
  },

  setFilter: (key, value) => {
    set((s) => ({ filters: { ...s.filters, [key]: value } }));
  },

  clearFilters: () => set({ filters: {} }),

  deleteSaving: async (id, goal_id) => {
    await savingsService.deleteSaving(id, goal_id);
    set((s) => ({ savings: s.savings.filter((sv) => sv.id !== id) }));
  },

  clearError: () => set({ error: null }),
}));
