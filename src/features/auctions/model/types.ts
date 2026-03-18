import type { User } from '../../auth/model/user-schema';
import type { Group } from '../../groups/model/types';

export interface Auction {
  id: string;
  title: string;
  url: string;
  auctionGroupId: string;
  auctionGroup: Group;
  users: User[];
}
export interface AuctionCreate {
  title: string;
  url: string;
  auctionGroupId: string;
  users?: string[];
}

export interface AuctionEdit {
  title?: string;
  url?: string;
  auctionGroupId?: string;
  users?: string[];
}
