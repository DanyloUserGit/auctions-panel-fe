import { useQuery } from '@tanstack/react-query';
import { fetchActiveSessions } from './api';

export const activeSessionsKeys = {
    all: ['sessions', 'active', 'mine'] as const,
};

export function useActiveSessions(enabled: boolean) {
    const {
        data = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: activeSessionsKeys.all,
        queryFn: fetchActiveSessions,
        staleTime: 0,
        enabled,
    });

    return {
        items: data,
        isLoading,
        isError,
        error: error ?? null,
    };
}