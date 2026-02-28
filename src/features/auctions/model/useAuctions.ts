import { useQuery } from '@tanstack/react-query';
import { fetchAuctions } from './api-auctions';
export const auctionsKeys = {
  all: ["auctions"] as const,
  byGroup: (groupId: string) => [...auctionsKeys.all, groupId] as const,
};

export function useAuctionsData(groupId: string) {

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: auctionsKeys.byGroup(groupId),
    queryFn: () => fetchAuctions(groupId),
    staleTime: 5 * 60 * 1000,
    enabled: !!groupId
  });


  return { items: data, isLoading, isError, error: error ?? null };
}