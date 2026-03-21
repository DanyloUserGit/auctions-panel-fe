import { api } from '../../../shared/http';
import type { ProcessesResponse } from './types';

export const fetchProcesses = async (clientKey: string = 'ALL_KEY'): Promise<ProcessesResponse> => {
    const response = await api.get<ProcessesResponse>('/processes', {
        params: { client: clientKey },
        headers: {
            'x-db-name': 'table_extourcars1' 
        }
    });

    return response.data;
};