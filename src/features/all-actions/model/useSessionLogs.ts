import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteSession, fetchAllActive, fetchAllClosed } from './api';
import type { SessionLog } from './types';

export const sessionLogsKeys = {
  all: ['sessionlogs'] as const,
  active: (take: number) => ['sessionlogs', 'active', take] as const,
  closed: (take: number) => ['sessionlogs', 'closed', take] as const,
} as const;

export function useActiveSessions(take: number = 20) {
  const { data, isLoading, isError, error, isPending } = useQuery({
    queryKey: sessionLogsKeys.active(take),
    queryFn: async () => {
      const response = await fetchAllActive(take);
      return response.data as SessionLog[];
    },
  });
  return { data, isLoading, isError, error, isPending };
}

export function useClosedSessions(take: number = 20) {
  const { data, isLoading, isError, error, isPending } = useQuery({
    queryKey: sessionLogsKeys.closed(take),
    queryFn: async () => {
      const response = await fetchAllClosed(take);
      return response.data as SessionLog[];
    },
  });
  return { data, isLoading, isError, error, isPending };
}

export function useTerminateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: sessionLogsKeys.all,
    mutationFn: (id: string) => deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionLogsKeys.all });
    },
    onError: (error) => {
      console.error('Помилка при завершенні сесії:', error);
    },
  });
}
