import type { Auction } from '../../auctions/model/types';

export interface Group {
  id: string;
  title: string;
  AdminId: string;
  auctions: Auction[];
  users: string[];
}
export interface GroupCreate {
  title: string;
  auctions: string[];
  AdminId: string | null;
  users: string[];
}
export interface GroupEdit {
  id?: string;
  title?: string;
  auctions?: string[];
  AdminId?: string;
  users: string[];
}
