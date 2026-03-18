import { useQuery } from '@tanstack/react-query';
import { fetchBalanceClients, fetchBalanceData } from './api';

export const balancesKeys = {
  all: ['balances'] as const,
  clients: (db: string) => [...balancesKeys.all, 'clients', db] as const,
  data: (db: string, client: string) =>
    [...balancesKeys.all, 'data', db, client] as const,
};

export function useBalanceClients(db: string) {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: balancesKeys.clients(db),
    queryFn: () => fetchBalanceClients(db),
    staleTime: 5 * 60 * 1000,
    enabled: !!db,
  });

  return { clients: data, isLoading, isError, error: error ?? null };
}

export function useBalanceData(db: string, selectedClient: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: balancesKeys.data(db, selectedClient),
    queryFn: () => fetchBalanceData(db, selectedClient),
    staleTime: 5 * 60 * 1000,
    enabled: !!db && !!selectedClient,
  });

  return {
    balances: data ?? null,
    isLoading,
    isError,
    error: error ?? null,
  };
}
