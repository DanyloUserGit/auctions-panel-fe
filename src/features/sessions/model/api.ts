import { api } from '../../../shared/http';

export const fetchSessions = async (accountId: string) => {
  if (!accountId) return [];
  const responce = await api.get(`/sessions/${accountId}`);
  return responce.data;
};
export const deleteSession = async (id: string) => {
  const responce = await api.delete(`/sessions/${id}`);
  return responce.data;
};

export const fetchActiveSessions = async () => {
  const responce = await api.get(`/sessions/active/mine`);
  return responce.data;
};