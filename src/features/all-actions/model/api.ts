import { api } from '../../../shared/http';
import type { LogFilters } from './types';

export const fetchAllActive = async (filters: LogFilters = {}) => {
  return api.get(`/dispatcher/sessions`, {
    params: { ...filters, isActive: true },
  });
};

export const fetchAllClosed = async (filters: LogFilters = {}) => {
  return api.get(`/dispatcher/sessions`, {
    params: { ...filters, isActive: false },
  });
};

export const fetchSessionLogs = async (
  sessionId: string,
  filters: LogFilters = {},
) => {
  return api.get(`/dispatcher/logs`, { params: { ...filters, sessionId } });
};

export const fetchAllForbidden = async (filters: LogFilters = {}) => {
  return api.get(`/dispatcher/logs/forbidden`, { params: filters });
};

export const fetchAllIncidents = async (filters: LogFilters = {}) => {
  return api.get(`/dispatcher/logs/incidents`, { params: filters });
};
export const deleteSession = async (id: string) => {
  const responce = await api.delete(`/sessions/${id}`);
  return responce.data;
};
