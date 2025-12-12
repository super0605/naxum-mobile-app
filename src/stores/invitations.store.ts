import { create } from 'zustand';
import { Invitation } from '../domain/types';
import * as api from '../services/api/endpoints';

type InvitationsState = {
  invitations: Invitation[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  invite: (payload: { inviteePhone: string; inviteeName?: string }) => Promise<{ inviteUrl: string }>;
};

export const useInvitationsStore = create<InvitationsState>((set, get) => ({
  invitations: [],
  loading: false,
  error: null,

  async refresh() {
    set({ loading: true, error: null });
    try {
      const res = await api.listInvitations();
      set({ invitations: res.invitations, loading: false });
    } catch {
      set({ error: 'Failed to load invitations', loading: false });
    }
  },

  async invite(payload) {
    const res = await api.createInvitation(payload);
    // optimistic refresh
    set({ invitations: [res.invitation, ...get().invitations] });
    return { inviteUrl: res.inviteUrl };
  },
}));
