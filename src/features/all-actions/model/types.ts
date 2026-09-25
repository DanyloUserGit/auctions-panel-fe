export type SessionStatus = 'active' | 'ended' | 'error';
export type SessionEndReason = 'Admin' | 'Inactivity' | 'NoConnections' | 'Error';

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isConnected: boolean;
  userGroup?: { id: string; name: string } | null;
}

// Сесія в «Всіх діях» (ТЗ 10).
export interface AuctionSession {
  id: string;
  isActive: boolean;
  status: SessionStatus;
  auctionId: string;
  auction: { id: string; title: string };
  account: { id: string; title: string };
  auctionGroup?: { id: string; title: string } | null;
  users: SessionUser[];
  activeConnections: number;
  maxConnections: number;
  createdAt: string;
  lastActivityAt: string;
  endedAt?: string | null;
  endReason?: SessionEndReason | null;
  errorMessage?: string | null;
  endedBy?: { id: string; email: string; firstName: string; lastName: string } | null;
  lastEvent?: { message: string; eventType: SessionEventType; createdAt: string } | null;
}

export type SessionEventType = 'ForbiddenAction' | 'Navigation' | 'SessionError' | 'TextInput' | 'ButtonClick' | 'Other';

export interface SessionEventLog {
  id: string;
  sessionId: string;
  userId?: string;
  user?: { id: string; email: string; firstName: string; lastName: string } | null;
  session?: { id: string; auction: { id: string; title: string }; account: { id: string; title: string } };
  eventType: SessionEventType;
  severity: 'Info' | 'Warning' | 'Critical';
  message: string;
  details?: Record<string, unknown>;
  isIncident: boolean;
  createdAt: string;
}

export interface LogFilters {
  search?: string;
  userId?: string;
  auctionId?: string;
  userGroupId?: string;
  startDate?: string;
  endDate?: string;
  eventType?: SessionEventType;
  isIncident?: boolean;
  status?: SessionStatus;
  sortBy?: 'time' | 'tag';
  sortOrder?: 'asc' | 'desc';
  take?: number;
  skip?: number;
}
