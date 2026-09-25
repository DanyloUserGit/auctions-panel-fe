import type { Group } from '../../groups/model/types';

export interface Auction {
  id: string;
  title: string;
  url: string;
  auctionGroupId: string;
  auctionGroup: Group;
  // Проксі без логіна/пароля (лише для відображення).
  proxyHost?: string | null;
}
export interface AuctionCreate {
  title: string;
  url: string;
  auctionGroupId: string;
}

export interface AuctionEdit {
  title?: string;
  url?: string;
  // Новий проксі (http(s)://логін:пароль@хост:порт); '' - прибрати; не передано - без змін.
  proxyUrl?: string;
  auctionGroupId?: string;
}
