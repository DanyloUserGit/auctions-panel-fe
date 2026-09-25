import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createInfo,
  fetchInfo,
  fetchInfoBySlug,
} from '../../information/model/api';
import type { CreateInfo } from '../../information/model/schemas';
import {
  createTraining,
  fetchTraining,
  publishMaterial,
  updateTraining,
  uploadTrainingImage,
} from './api';
import type { CreateTraining, EditTraining } from './types';

export const trainingKeys = {
  all: ['training'] as const,
  materials: () => [...trainingKeys.all, 'materials'] as const,
  detail: (id: string) => [...trainingKeys.materials(), id] as const,
  info: () => [...trainingKeys.all, 'info'] as const,
  infoDetail: (slug: string) => [...trainingKeys.info(), slug] as const,
};

export function useTraining(query: string) {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [...trainingKeys.materials(), query],
    queryFn: () => fetchTraining(query),
    staleTime: 5 * 60 * 1000,
    enabled: query.length >= 2 || query.length === 0,
  });

  return { items: data, isLoading, isError, error: error ?? null };
}

export function useCreateTraining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTraining) => createTraining(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.materials() });
    },
  });
}
export function useUpdateTraining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditTraining }) =>
      updateTraining(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.materials() });
    },
  });
}
export function usePublishTraining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      publishMaterial(id, isPublished),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.materials() });
      queryClient.invalidateQueries({
        queryKey: trainingKeys.detail(variables.id),
      });
    },
  });
}

export interface UploadImagePayload {
  id: string;
  file: File;
}
export function useUploadMaterialImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: UploadImagePayload) =>
      uploadTrainingImage(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.materials() });
      queryClient.invalidateQueries({
        queryKey: trainingKeys.detail(variables.id),
      });
    },
  });
}

// Видалення матеріалу
// export function useDeleteTraining() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (id: string) => deleteTraining(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: trainingKeys.materials() });
//     },
//   });
// }

// // ХУКИ ДЛЯ ІНФОРМАЦІЙНИХ СТОРІНОК (FAQ/Правила)

export function useInfoPages() {
  return useQuery({
    queryKey: trainingKeys.info(),
    queryFn: () => fetchInfo(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useInfoPageDetail(slug: string) {
  return useQuery({
    queryKey: trainingKeys.infoDetail(slug),
    queryFn: () => fetchInfoBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInfo) => createInfo(data),
    mutationKey: trainingKeys.info(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.info() });
    },
    onError: (error) => {
      console.error('Помилка при створенні інформаційної сторінки:', error);
    },
  });
}
