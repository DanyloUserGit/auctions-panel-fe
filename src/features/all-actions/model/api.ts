import { api } from '../../../shared/http';
import type { AuctionSession, LogFilters, SessionEventLog } from './types';

const clean = (filters: LogFilters) =>
  Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''));

export const fetchSessions = async (filters: LogFilters & { isActive: boolean }) =>
  (await api.get<{ data: AuctionSession[]; total: number }>('/dispatcher/sessions', { params: clean(filters) })).data;

export const fetchSessionLogs = async (sessionId: string, filters: LogFilters = {}) =>
  (await api.get<SessionEventLog[]>('/dispatcher/logs', { params: clean({ ...filters, sessionId } as LogFilters) })).data;

export const fetchForbiddenLogs = async (filters: LogFilters = {}) =>
  (await api.get<SessionEventLog[]>('/dispatcher/logs/forbidden', { params: clean(filters) })).data;

export const fetchIncidentLogs = async (filters: LogFilters = {}) =>
  (await api.get<SessionEventLog[]>('/dispatcher/logs/incidents', { params: clean(filters) })).data;

export const fetchAllLogs = async (filters: LogFilters = {}) =>
  (await api.get<SessionEventLog[]>('/dispatcher/logs', { params: clean(filters) })).data;

export const deleteSession = async (id: string) => (await api.delete(`/sessions/${id}`)).data;
