import { api } from '../../../shared/http';
import type { ProcessesResponse } from './types';

export interface FetchProcessesParams {
  search?: string;
  asof?: string;
  open?: boolean;
}

export const fetchProcesses = async (
  params: FetchProcessesParams = {},
): Promise<ProcessesResponse> => {
  const response = await api.get<ProcessesResponse>('/processes', {
    params: {
      client: 'ALL_KEY', // Залишаємо ALL_KEY, оскільки вибір клієнта прибрано
      search: params.search || '',
      asof: params.asof || '',
      open: params.open !== undefined ? params.open : true,
    },
  });

  return response.data;
};
