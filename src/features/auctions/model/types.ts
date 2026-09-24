import type { Group } from '../../groups/model/types';

export interface Auction {
  id: string;
  title: string;
  url: string;
  auctionGroupId: string;
  auctionGroup: Group;
}
export interface AuctionCreate {
  title: string;
  url: string;
  auctionGroupId: string;
}

export interface AuctionEdit {
  title?: string;
  url?: string;
  auctionGroupId?: string;
}
