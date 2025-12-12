import { create } from 'zustand';
import { TeamMember, TeamNode } from '../domain/types';
import * as api from '../services/api/endpoints';

type TeamState = {
  members: TeamMember[];
  hierarchy: TeamNode | null;
  loading: boolean;
  error: string | null;
  refreshMembers: () => Promise<void>;
  loadHierarchy: () => Promise<void>;
};

export const useTeamStore = create<TeamState>((set) => ({
  members: [],
  hierarchy: null,
  loading: false,
  error: null,

  async refreshMembers() {
    set({ loading: true, error: null });
    try {
      const res = await api.listTeamMembers();
      set({ members: res.members, loading: false });
    } catch {
      set({ error: 'Failed to load team members', loading: false });
    }
  },

  async loadHierarchy() {
    set({ loading: true, error: null });
    try {
      const res = await api.getHierarchy();
      set({ hierarchy: res.tree, loading: false });
    } catch {
      set({ error: 'Failed to load hierarchy', loading: false });
    }
  },
}));
