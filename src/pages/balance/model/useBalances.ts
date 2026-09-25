import { useQuery } from '@tanstack/react-query';
import { fetchBalanceClients, fetchBalanceData } from './api';

export const balancesKeys = {
  all: ['balances'] as const,
  clients: () => [...balancesKeys.all, 'clients'] as const,
  data: (client: string) => [...balancesKeys.all, 'data', client] as const,
};

export function useBalanceClients() {
  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: balancesKeys.clients(),
    queryFn: fetchBalanceClients,
    staleTime: 5 * 60 * 1000,
  });

  return { clients: data, isLoading, isError, error: error ?? null };
}

export function useBalanceData(selectedClient: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: balancesKeys.data(selectedClient),
    queryFn: () => fetchBalanceData(selectedClient),
    staleTime: 5 * 60 * 1000,
    enabled: !!selectedClient,
  });

  return {
    balances: data ?? null,
    isLoading,
    isError,
    error: error ?? null,
  };
}
