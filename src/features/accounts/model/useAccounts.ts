import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addToFavourite,
  createAcount,
  deleteAcount,
  fetchAcountsByAuction,
  GetFavourite,
  RemoveFromFavourite,
  updateAcount,
} from './api-accounts';
import type { AccountCreate, AccountUpdate } from './types';

export const accountKeys = {
  all: ['accounts'] as const,
  byAuction: (auctionId: string) =>
    [...accountKeys.all, 'by-auction', auctionId] as const,
  favorites: () => [...accountKeys.all, 'favorites'] as const,
};

export function useAccounts(auctionId: string) {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: accountKeys.byAuction(auctionId),
    queryFn: () => fetchAcountsByAuction(auctionId),
    staleTime: 5 * 60 * 1000,
    enabled: !!auctionId,
  });

  return { items: data, isLoading, isError, error: error ?? null };
}

export function useCreateAcount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AccountCreate) => createAcount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export function useEditAcount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AccountUpdate }) =>
      updateAcount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export function useDeleteAcount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAcount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}
export function useFavoriteAccounts() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: accountKeys.favorites(),
    queryFn: GetFavourite,
    staleTime: 10 * 60 * 1000,
  });

  return { items: data || [], isLoading, isError, error: error ?? null };
}

export function useAddToFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) => addToFavourite(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.favorites() });
    },
  });
}

export function useRemoveFromFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) => RemoveFromFavourite(accountId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.favorites() });
    },
  });
}
