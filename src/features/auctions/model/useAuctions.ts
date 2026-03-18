import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAuction,
  deleteAuction,
  editAuction,
  fetchAuctionsByGroup,
  fetchAuctionsById,
} from './api-auctions';
import type { AuctionCreate, AuctionEdit } from './types';
export const auctionsKeys = {
  all: ['auctions'] as const,
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
    queryFn: () => fetchAuctionsByGroup(groupId),
    staleTime: 5 * 60 * 1000,
    enabled: !!groupId,
  });

  return { items: data, isLoading, isError, error: error ?? null };
}
export function useAuction(auctionId: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: auctionsKeys.byGroup(auctionId),
    queryFn: () => fetchAuctionsById(auctionId),
    staleTime: 5 * 60 * 1000,
    enabled: !!auctionId,
  });

  return { data, isLoading, isError, error: error ?? null };
}

export function useCreateAuction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AuctionCreate) => createAuction(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auctions'] }),
  });
}

export function useEditAuction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AuctionEdit }) =>
      editAuction(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auctions'] }),
  });
}

export function useDeleteAuction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAuction(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auctions'] }),
  });
}
