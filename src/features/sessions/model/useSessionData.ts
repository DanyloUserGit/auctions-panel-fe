import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSession, fetchSessions } from "./api";

export const sessionsKeys = {
    all: ["sessions"] as const,
    byAccount: (accountId: string) => [...sessionsKeys.all, accountId] as const,
};

export function useSessionsData(accountId: string) {
    const queryClient = useQueryClient()
    const {
        data = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: sessionsKeys.byAccount(accountId),
        queryFn: () => fetchSessions(accountId),
        staleTime: 5 * 60 * 1000,
        enabled: !!accountId
    });

    const DeleteSessionMutation = useMutation({
        mutationFn: (id: string) => deleteSession(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sessionsKeys.all });
        }
    })

    return { items: data, isLoading, isError, error: error ?? null, DeleteSessionMutation };
}