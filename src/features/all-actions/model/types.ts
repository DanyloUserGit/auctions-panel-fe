import type { Auction } from '../../auctions/model/types';

export interface AuctionSession {
  id: string;
  isActive: boolean;
  auctionId: string;
  auction: Auction;
  auctionGroupId?: string;
  users?: { id: string; email: string; firstName: string; lastName: string }[];
  createdAt: string;
  endedAt?: string;
}

export interface SessionEventLog {
  id: string;
  sessionId: string;
  userId?: string;
  user?: { id: string; email: string; firstName: string; lastName: string };
  eventType:
    | 'ForbiddenAction'
    | 'Navigation'
    | 'SessionError'
    | 'TextInput'
    | 'ButtonClick'
    | 'Other';
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
  auctionGroupId?: string;
  startDate?: string;
  endDate?: string;
  eventType?: string;
  isIncident?: boolean;
  take?: number;
  skip?: number;
}
