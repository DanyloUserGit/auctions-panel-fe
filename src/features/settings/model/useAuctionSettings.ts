import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addAuctionAllowedPath,
  addAuctionForbiddenPath,
  addAuctionSelector,
  addAuctionUser,
  fetchAllowedPaths,
  fetchForbiddenPaths,
  fetchForbiddenSelectors,
  removeAllowedPath,
  removeAuctionUser,
  removeForbiddenPath,
  removeForbiddenSelector,
} from './api-auctions-settings';
import { auctionsKeys } from '../../auctions/model/useAuctions';

// 1. Оновлені ключі: тепер вони приймають auctionId
export const auctionSettingsKeys = {
  all: ['auctions', 'settings'] as const,
  forbiddenPaths: (id?: string) =>
    [...auctionSettingsKeys.all, id, 'forbidden-paths'] as const,
  forbiddenSelectors: (id?: string) =>
    [...auctionSettingsKeys.all, id, 'forbidden-selectors'] as const,
  allowedPaths: (id?: string) =>
    [...auctionSettingsKeys.all, id, 'allowed-paths'] as const,
};

export const useForbiddenPaths = (auctionId: string) => {
  return useQuery({
    queryKey: auctionSettingsKeys.forbiddenPaths(auctionId),
    queryFn: () => fetchForbiddenPaths(auctionId),
    staleTime: 1000,
    enabled: !!auctionId,
  });
};

export const useForbiddenSelectors = (auctionId: string) => {
  return useQuery({
    queryKey: auctionSettingsKeys.forbiddenSelectors(auctionId),
    queryFn: () => fetchForbiddenSelectors(auctionId),
    staleTime: 1000,
    enabled: !!auctionId,
  });
};

export const useAllowedPaths = (auctionId: string) => {
  return useQuery({
    queryKey: auctionSettingsKeys.allowedPaths(auctionId),
    queryFn: () => fetchAllowedPaths(auctionId),
    staleTime: 1000,
    enabled: !!auctionId,
  });
};

// 3. Mutations з правильною інвалідацією через variables.id

export const useAddAuctionUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      addAuctionUser(id, { userId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: auctionsKeys.all });
      // Оновлюємо конкретний аукціон, щоб побачити нового юзера
      queryClient.invalidateQueries({ queryKey: ['auctions', variables.id] });
    },
  });
};

export const useAddAuctionSelector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, selector }: { id: string; selector: string }) =>
      addAuctionSelector(id, { selector }),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({
        queryKey: auctionSettingsKeys.forbiddenSelectors(variables.id),
      }),
  });
};

export const useAddAllowedPath = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, path }: { id: string; path: string }) =>
      addAuctionAllowedPath(id, { path }),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({
        queryKey: auctionSettingsKeys.allowedPaths(variables.id),
      }),
  });
};

export const useAddForbiddenPath = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, path }: { id: string; path: string }) =>
      addAuctionForbiddenPath(id, { path }),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({
        queryKey: auctionSettingsKeys.forbiddenPaths(variables.id),
      }),
  });
};

// --- ВИДАЛЕННЯ ---

// --- ВИДАЛЕННЯ (Виправлено) ---

export const useRemoveAllowedPath = () => {
  // Прибираємо аргумент звідси
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; auctionId: string }) =>
      removeAllowedPath(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: auctionSettingsKeys.allowedPaths(variables.auctionId),
      });
    },
  });
};

export const useRemoveForbiddenPath = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; auctionId: string }) =>
      removeForbiddenPath(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: auctionSettingsKeys.forbiddenPaths(variables.auctionId),
      });
    },
  });
};

export const useRemoveForbiddenSelector = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; auctionId: string }) =>
      removeForbiddenSelector(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: auctionSettingsKeys.forbiddenSelectors(variables.auctionId),
      });
    },
  });
};

export const useRemoveAuctionUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      removeAuctionUser(id, { userId }),
    onSuccess: (_, variables) => {
      // Оновлюємо всі пов'язані дані, щоб юзер зник всюди
      queryClient.invalidateQueries({ queryKey: ['auctions', variables.id] });
      queryClient.invalidateQueries({
        queryKey: auctionSettingsKeys.all,
      });
      queryClient.invalidateQueries({ queryKey: auctionsKeys.all });
    },
    onError: (error) => {
      console.error('Помилка при видаленні користувача:', error);
    },
  });
};
