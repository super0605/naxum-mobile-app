import { create } from 'zustand';
import { tokenStorage } from '../services/auth/tokenStorage';
import * as api from '../services/api/endpoints';
import { User } from '../domain/types';

type AuthState = {
  user: User | null;
  token: string | null;
  isBootstrapping: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { email: string; phone: string; password: string; name: string; role: 'LEADER' | 'MEMBER'; inviteToken?: string }) => Promise<void>;
  bootstrap: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isBootstrapping: true,
  error: null,

  async login(email, password) {
    set({ error: null });
    try {
      const res = await api.login({ email, password });
      await tokenStorage.setToken(res.token);
      set({ token: res.token, user: res.user, error: null });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Invalid email or password';
      set({ error: errorMessage, token: null, user: null });
      throw error; // Re-throw so the UI can handle it
    }
  },

  async register(payload) {
    set({ error: null });
    try {
      const res = await api.register(payload);
      await tokenStorage.setToken(res.token);
      set({ token: res.token, user: res.user, error: null });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Registration failed';
      set({ error: errorMessage, token: null, user: null });
      throw error; // Re-throw so the UI can handle it
    }
  },

  async bootstrap() {
    set({ isBootstrapping: true, error: null });
    const token = await tokenStorage.getToken();
    if (!token) {
      set({ token: null, user: null, isBootstrapping: false });
      return;
    }
    try {
      const me = await api.me();
      set({ token, user: me.user, isBootstrapping: false });
    } catch {
      await tokenStorage.clearToken();
      set({ token: null, user: null, isBootstrapping: false, error: 'Session expired' });
    }
  },

  async logout() {
    await tokenStorage.clearToken();
    set({ token: null, user: null });
  },
}));
