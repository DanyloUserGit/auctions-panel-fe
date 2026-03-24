import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteSession,
  fetchAllActive,
  fetchAllClosed,
  fetchAllForbidden,
  fetchAllIncidents,
  fetchSessionLogs,
} from './api';
import type { AuctionSession, LogFilters, SessionEventLog } from './types';

export const sessionLogsKeys = {
  all: ['sessionlogs'] as const,
  active: (filters: LogFilters) => ['sessionlogs', 'active', filters] as const,
  closed: (filters: LogFilters) => ['sessionlogs', 'closed', filters] as const,
  forbidden: (filters: LogFilters) =>
    ['sessionlogs', 'forbidden', filters] as const,
  incidents: (filters: LogFilters) =>
    ['sessionlogs', 'incidents', filters] as const,
  sessionHistory: (sessionId: string, filters: LogFilters) =>
    ['sessionlogs', 'history', sessionId, filters] as const,
} as const;

export function useActiveSessions(filters: LogFilters = { take: 50 }) {
  return useQuery({
    queryKey: sessionLogsKeys.active(filters),
    queryFn: async () =>
      (await fetchAllActive(filters)).data as AuctionSession[],
  });
}

export function useClosedSessions(filters: LogFilters = { take: 50 }) {
  return useQuery({
    queryKey: sessionLogsKeys.closed(filters),
    queryFn: async () =>
      (await fetchAllClosed(filters)).data as AuctionSession[],
  });
}

export function useForbiddenLogs(filters: LogFilters = { take: 50 }) {
  return useQuery({
    queryKey: sessionLogsKeys.forbidden(filters),
    queryFn: async () =>
      (await fetchAllForbidden(filters)).data as SessionEventLog[],
  });
}

export function useIncidentLogs(filters: LogFilters = { take: 50 }) {
  return useQuery({
    queryKey: sessionLogsKeys.incidents(filters),
    queryFn: async () =>
      (await fetchAllIncidents(filters)).data as SessionEventLog[],
  });
}

export function useSessionLogsHistory(
  sessionId: string | undefined,
  filters: LogFilters = { take: 100 },
) {
  return useQuery({
    queryKey: sessionLogsKeys.sessionHistory(sessionId || '', filters),
    queryFn: async () => {
      if (!sessionId) return [];
      const response = await fetchSessionLogs(sessionId, filters);
      return response.data as SessionEventLog[];
    },
    enabled: !!sessionId,
  });
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
