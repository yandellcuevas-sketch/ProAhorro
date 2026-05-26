import { create } from 'zustand';
import type { User, Settings } from '../types';
import { authService } from '../services/authService';
import { accountService } from '../services/accountService';

interface AuthState {
  user: User | null;
  settings: Settings | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  loadSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  settings: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  loadSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.getSession();
      if (session) {
        const [user, settings] = await Promise.all([
          authService.getCurrentUser(),
          accountService.getSettings(),
        ]);
        set({
          user,
          settings: settings as Settings | null,
          isAuthenticated: !!user,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.login(email, password);
      const [user, settings] = await Promise.all([
        authService.getCurrentUser(),
        accountService.getSettings(),
      ]);
      set({ user, settings: settings as Settings | null, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(name, email, password);
      // La sesión se carga automáticamente tras registro
      await get().loadSession();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await authService.logout();
    set({ user: null, settings: null, isAuthenticated: false, isLoading: false });
  },

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(email);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  refreshUser: async () => {
    const user = await authService.getCurrentUser();
    const settings = await accountService.getSettings();
    set({ user, settings: settings as Settings | null });
  },

  clearError: () => set({ error: null }),
}));
