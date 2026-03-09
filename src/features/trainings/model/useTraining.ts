import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTraining, fetchTraining } from './api'; // Переконайтеся, що ці функції експортуються з api.ts
import type { CreateTraining } from './types';

export const trainingKeys = {
  all: ['training'] as const,
  materials: () => [...trainingKeys.all, 'materials'] as const,
  detail: (id: string) => [...trainingKeys.materials(), id] as const,
  info: () => [...trainingKeys.all, 'info'] as const,
  infoDetail: (slug: string) => [...trainingKeys.info(), slug] as const,
};

export function useTraining() {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: trainingKeys.materials(),
    queryFn: () => fetchTraining(),
    staleTime: 5 * 60 * 1000,
  });

  return { items: data, isLoading, isError, error: error ?? null };
}

// Створення матеріалу
export function useCreateTraining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTraining) => createTraining(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trainingKeys.materials() });
    },
  });
}

// // Зміна статусу публікації (Published/Draft)
// export function usePublishTraining() {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
//             publishMaterial(id, isPublished),
//         onSuccess: (_, variables) => {
//             queryClient.invalidateQueries({ queryKey: trainingKeys.materials() });
//             queryClient.invalidateQueries({ queryKey: trainingKeys.detail(variables.id) });
//         },
//     });
// }

// // Видалення матеріалу
// export function useDeleteTraining() {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: (id: string) => deleteTraining(id),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: trainingKeys.materials() });
//         },
//     });
// }

// // ХУКИ ДЛЯ ІНФОРМАЦІЙНИХ СТОРІНОК (FAQ/Правила)

// export function useInfoPages() {
//     return useQuery({
//         queryKey: trainingKeys.info(),
//         queryFn: () => fetchInfoPages(),
//         staleTime: 10 * 60 * 1000,
//     });
// }

// export function useInfoPageDetail(slug: string) {
//     return useQuery({
//         queryKey: trainingKeys.infoDetail(slug),
//         queryFn: () => fetchInfoPageBySlug(slug),
//         enabled: !!slug,
//         staleTime: 10 * 60 * 1000,
//     });
// }
