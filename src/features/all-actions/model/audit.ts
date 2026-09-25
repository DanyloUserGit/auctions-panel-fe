import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '../../../shared/http';

export type AuditCategory = 'Auth' | 'Admin';

type Person = { id: string; firstName: string; lastName: string; email: string } | null;

export interface AuditEntry {
  id: string;
  category: AuditCategory;
  action: string;
  message: string;
  details?: Record<string, unknown> | null;
  actor: Person;
  targetUser: Person;
  ip?: string | null;
  createdAt: string;
}

export interface AuditFilters {
  category: AuditCategory;
  userId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  take?: number;
}

const clean = (filters: AuditFilters) =>
  Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''));

// Журнали входів і дій адміністраторів (ТЗ 4, 9; [?23]).
export function useAuditLog(filters: AuditFilters, enabled: boolean) {
  return useQuery({
    queryKey: ['audit-log', filters],
    queryFn: async () => (await api.get<AuditEntry[]>('/audit-log', { params: clean(filters) })).data,
    refetchInterval: 5000,
    placeholderData: keepPreviousData,
    enabled,
  });
}
