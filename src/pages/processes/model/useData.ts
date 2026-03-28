import { useQuery } from '@tanstack/react-query';
import { fetchProcesses, type FetchProcessesParams } from './api';
import type { ProcessesResponse } from './types';

export const useProcessesData = (params: FetchProcessesParams) => {
  return useQuery<ProcessesResponse, Error>({
    // queryKey залежить від параметрів, щоб React Query автоматично робив новий запит при їх зміні
    queryKey: ['processes', params.search, params.asof, params.open],
    queryFn: () => fetchProcesses(params),
    staleTime: 5 * 60 * 1000,
  });
};
