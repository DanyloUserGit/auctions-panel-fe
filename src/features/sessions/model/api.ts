import { api } from '../../../shared/http';
import type { TabInfo } from './tabs';

type ActiveSession = { id: string; auctionId: string; auctionAuthId: string; auctionTitle: string; accountTitle: string };

// Сесії, до яких користувач зараз підключений (для відновлення вкладок після входу/оновлення сторінки).
export const fetchMyTabs = async (): Promise<TabInfo[]> => {
  const { data } = await api.get<ActiveSession[]>('/sessions/active/mine');
  return data.map(({ auctionId, auctionAuthId, auctionTitle, accountTitle }) => ({ auctionId, auctionAuthId, auctionTitle, accountTitle }));
};
