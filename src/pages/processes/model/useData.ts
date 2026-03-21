import { useQuery } from '@tanstack/react-query';
import { fetchProcesses } from './api';
import type { ProcessesResponse } from './types';

export const useProcessesData = (clientKey: string = 'ALL_KEY') => {
    return useQuery<ProcessesResponse, Error>({
        queryKey: ['processes', clientKey], 
        queryFn: () => fetchProcesses(clientKey),
        staleTime: 5 * 60 * 1000, 
    });
};