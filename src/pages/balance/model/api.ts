import { api } from '../../../shared/http';
import type { ClientBalance } from './types';

// Базу CRM визначає сервер; клієнти й баланси - лише в межах доступних користувачу.
export const fetchBalanceClients = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/balance/clients');
  return response.data;
};

export const fetchBalanceData = async (client: string): Promise<ClientBalance[] | null> => {
  if (!client) return null;
  const response = await api.get<ClientBalance[]>('/balance/data', { params: { client } });
  return response.data;
};
