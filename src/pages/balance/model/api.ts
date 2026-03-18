import { api } from '../../../shared/http';
import type { ClientBalance } from './types';

export const fetchBalanceClients = async (db: string): Promise<string[]> => {
  if (!db) return [];

  const response = await api.get<string[]>('/balance/clients', {
    params: { db },
  });
  return response.data;
};

export const fetchBalanceData = async (
  db: string,
  client: string,
): Promise<ClientBalance[] | null> => {
  if (!db || !client) return null;

  const response = await api.get<ClientBalance[]>('/balance/data', {
    params: { db, client },
  });
  return response.data;
};
