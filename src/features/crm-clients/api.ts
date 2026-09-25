import { api } from '../../shared/http';

export interface AssignedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CrmClient {
  clientName: string;
  users: AssignedUser[];
}

export const fetchCrmClients = async (): Promise<CrmClient[]> => (await api.get('/crm-clients')).data;

export const saveCrmClientAssignment = async (payload: { clientName: string; userIds: string[] }) =>
  (await api.put('/crm-clients/assignment', payload)).data;
