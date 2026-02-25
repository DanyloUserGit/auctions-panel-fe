import { useQuery } from '@tanstack/react-query';
import { fetchGroups } from '../http';
export const groupsKeys = {
  key: ["groups"] as const,
};


export function useGroups() {

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: groupsKeys.key,
    queryFn: fetchGroups,
    staleTime: 5 * 60 * 1000,
  });


  return { items: data, isLoading, isError, error: error ?? null };
}