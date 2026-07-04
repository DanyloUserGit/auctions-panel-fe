import type { Auction } from '../../auctions/model/types';
import type { User } from '../../auth/model/user-schema';

export interface Group {
  id: string;
  showAccounts: boolean;
  title: string;
  AdminId: string;
  auctions: Auction[];
  accounts: User[];
  canGaManageAccounts: boolean;
  rules: string;
  sessionLimit: number;
  allowedProfileFields: 'firstName' | 'lastName' | 'phone' | 'city';
  auctionsCount: number;
  isActive: boolean;
  lastActivity: string;
  usersCount: number;
  _count: { users: number; auctions: number };
}
export interface GroupCreate {
  title: string;
  auctions: Auction[];
  Admin: string | null;
  users: User[];
}
export interface GroupEdit {
  title?: string;
  auctions?: string[];
  Admin?: string;
  users?: string[];
  canGaManageAccounts?: boolean;
  // rules: {}
  sessionLimit?: number;
  isActive?: boolean;
}
