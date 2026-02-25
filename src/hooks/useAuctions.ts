import { useQuery } from '@tanstack/react-query';
import { fetchAuctions } from '../http';
export const auctionsKeys = {
  key: ["auctions"] as const,
};


export function useAuctionsData() {

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: auctionsKeys.key,
    queryFn: fetchAuctions,
    staleTime: 5 * 60 * 1000,
  });


  return { items: data, isLoading, isError, error: error ?? null };
}