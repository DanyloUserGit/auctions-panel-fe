import { useQuery } from '@tanstack/react-query';
import { fetchAuctionsByQuery } from './api-auctions';
export const auctionsKeys = {
  key: ['search'] as const,
};

export function useAuctionsSearch(q: string) {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: auctionsKeys.key,
    queryFn: () => fetchAuctionsByQuery(q),
    staleTime: 5 * 60 * 1000,
    enabled: !!q,
  });

  return { items: data, isLoading, isError, error: error ?? null };
}
