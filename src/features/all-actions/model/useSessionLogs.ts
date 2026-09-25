import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteSession, fetchAllLogs, fetchForbiddenLogs, fetchIncidentLogs, fetchSessionLogs, fetchSessions } from './api';
import type { LogFilters } from './types';

// «Всі дії» оновлюються без перезавантаження сторінки (ТЗ 20).
const LIVE_REFRESH_MS = 5000;

export const sessionLogsKeys = {
  all: ['sessionlogs'] as const,
  sessions: (isActive: boolean, filters: LogFilters) => ['sessionlogs', 'sessions', isActive, filters] as const,
  logs: (kind: string, filters: LogFilters) => ['sessionlogs', kind, filters] as const,
  sessionHistory: (sessionId: string, filters: LogFilters) => ['sessionlogs', 'history', sessionId, filters] as const,
} as const;

export function useDispatcherSessions(isActive: boolean, filters: LogFilters, enabled = true) {
  return useQuery({
    queryKey: sessionLogsKeys.sessions(isActive, filters),
    queryFn: () => fetchSessions({ ...filters, isActive }),
    refetchInterval: LIVE_REFRESH_MS,
    placeholderData: keepPreviousData,
    enabled,
  });
}

const fetchers = { forbidden: fetchForbiddenLogs, incidents: fetchIncidentLogs, all: fetchAllLogs };

export function useLogs(kind: keyof typeof fetchers, filters: LogFilters, enabled = true) {
  return useQuery({
    queryKey: sessionLogsKeys.logs(kind, filters),
    queryFn: () => fetchers[kind](filters),
    refetchInterval: LIVE_REFRESH_MS,
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useSessionLogsHistory(sessionId: string | undefined, filters: LogFilters = { take: 200 }) {
  return useQuery({
    queryKey: sessionLogsKeys.sessionHistory(sessionId || '', filters),
    queryFn: () => fetchSessionLogs(sessionId!, filters),
    enabled: !!sessionId,
    refetchInterval: LIVE_REFRESH_MS,
    placeholderData: keepPreviousData,
  });
}

export function useTerminateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: sessionLogsKeys.all,
    mutationFn: (id: string) => deleteSession(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionLogsKeys.all }),
  });
}
