export type UserRole = 'LEADER' | 'MEMBER';

export type User = {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  invitedByUserId?: string | null;
  createdAt?: string;
};

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export type Invitation = {
  id: string;
  inviteePhone: string;
  inviteeName?: string | null;
  status: InvitationStatus;
  token: string;
  createdAt: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  invitedByUserId?: string | null;
  createdAt: string;
};

export type TeamNode = {
  id: string;
  name: string;
  role: UserRole;
  invitedByUserId: string | null;
  children: TeamNode[];
};

export type TaskStatus = 'OPEN' | 'COMPLETED';

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  completedAt?: string | null;
  createdAt: string;
  assignedToUserId: string;
  assignedTo?: { id: string; name: string; email?: string };
  createdBy?: { id: string; name: string; email?: string };
};
