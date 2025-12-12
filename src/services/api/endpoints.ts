import { api } from './client';
import { Invitation, Task, TeamMember, TeamNode, User } from '../../domain/types';

export async function register(payload: {
  email: string;
  phone: string;
  password: string;
  name: string;
  role: 'LEADER' | 'MEMBER';
  inviteToken?: string;
}): Promise<{ user: User; token: string }> {
  const res = await api.post('/auth/register', payload);
  return res.data;
}

export async function login(payload: { email: string; password: string }): Promise<{ user: User; token: string }> {
  const res = await api.post('/auth/login', payload);
  return res.data;
}

export async function me(): Promise<{ user: User }> {
  const res = await api.get('/auth/me');
  return res.data;
}

export async function createInvitation(payload: {
  inviteePhone: string;
  inviteeName?: string;
}): Promise<{ invitation: Invitation; inviteUrl: string }> {
  const res = await api.post('/invitations', payload);
  return res.data;
}

export async function listInvitations(): Promise<{ invitations: Invitation[] }> {
  const res = await api.get('/invitations');
  return res.data;
}

export async function getLeaderInvitations(): Promise<Invitation[]> {
  const res = await api.get('/invitations');
  return res.data.invitations;
}

export async function getMyInvitations(): Promise<Invitation[]> {
  const res = await api.get('/invitations/my');
  return res.data.invitations;
}

export async function acceptInvitation(id: string): Promise<Invitation> {
  const res = await api.post(`/invitations/${id}/accept`);
  return res.data.invitation;
}

export async function declineInvitation(id: string): Promise<Invitation> {
  const res = await api.post(`/invitations/${id}/decline`);
  return res.data.invitation;
}

export type InvitationStatus = {
  phone: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'MEMBER' | 'NOT_INVITED';
  canInvite: boolean;
};

export async function checkInvitationStatus(phoneNumbers: string[]): Promise<{ statuses: InvitationStatus[] }> {
  const res = await api.post('/invitations/check-status', { phoneNumbers });
  return res.data;
}

export async function listTeamMembers(): Promise<{ members: TeamMember[] }> {
  const res = await api.get('/team/members');
  return res.data;
}

export async function getHierarchy(): Promise<{ tree: TeamNode }> {
  const res = await api.get('/team/hierarchy');
  return res.data;
}

export async function getTeamStats(): Promise<{ stats: { totalTeamSize: number; activeMembers: number; completionRate: number } }> {
  const res = await api.get('/team/stats');
  return res.data;
}

export async function createTask(payload: {
  assignedToUserId: string;
  title: string;
  description?: string;
}): Promise<{ task: Task }> {
  const res = await api.post('/tasks', payload);
  return res.data;
}

export async function listTasks(params?: { status?: 'OPEN' | 'COMPLETED'; assignedToUserId?: string }): Promise<{ tasks: Task[] }> {
  const res = await api.get('/tasks', { params });
  return res.data;
}

export async function getTask(id: string): Promise<{ task: Task }> {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
}

export async function completeTask(id: string): Promise<{ task: Task }> {
  const res = await api.patch(`/tasks/${id}/complete`);
  return res.data;
}

export async function completionByMember(): Promise<{ data: Array<{ memberId: string; memberName: string; total: number; completed: number; completionRate: number }> }> {
  const res = await api.get('/tasks/by-member');
  return res.data;
}
