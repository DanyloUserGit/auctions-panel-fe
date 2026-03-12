import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createInfo, editInfo, fetchInfo, fetchInfoBySlug } from './api';
import type { CreateInfo } from './schemas';
import type { EditInfo } from './types';
export const infoKeys = {
  all: ['info'] as const,
  bySlug: (slug: string) => ['info', slug] as const,
} as const;
export function useInfo() {
  const { data, isLoading, isError, error, isPending } = useQuery({
    queryFn: fetchInfo,
    queryKey: infoKeys.all,
  });
  return { data, isLoading, isError, error, isPending };
}
export function useInfoBySlug(slug: string) {
  const { data, isLoading, isError, error, isPending } = useQuery({
    queryFn: () => fetchInfoBySlug(slug),
    queryKey: infoKeys.bySlug(slug),
  });
  return { data, isLoading, isError, error, isPending };
}

export function useCreateInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInfo) => createInfo(data),
    mutationKey: infoKeys.all,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: infoKeys.all });
    },
    onError: (error) => {
      console.error('Помилка при створенні інформаційної сторінки:', error);
    },
  });
}
export function useUpdateInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditInfo }) =>
      editInfo(id, data),
    mutationKey: infoKeys.all,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: infoKeys.all });
    },
    onError: (error) => {
      console.error('Помилка при створенні інформаційної сторінки:', error);
    },
  });
}
