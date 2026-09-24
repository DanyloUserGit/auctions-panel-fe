import type { Auction } from '../../auctions/model/types';

export interface Group {
  id: string;
  title: string;
  sessionLimit: number;
  auctions: Auction[];
  auctionsCount: number;
  sessionsCount: number;
}

export interface GroupCreate {
  title: string;
  sessionLimit?: number;
  auctions?: string[];
}

export interface GroupEdit {
  title?: string;
  sessionLimit?: number;
  auctions?: string[];
}
