// useOrders.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi, type CreateOrderPayload } from './api';

// Оновлені ключі для кешу react-query
export const orderKeys = {
  all: ['orders'] as const,
  // Додаємо новий ключ для списку з фільтром
  list: (search?: string) => ['orders', 'list', search] as const,
  detail: (id: number) => ['orders', id] as const,
};

// Додано параметр search до хука
export const useOrdersList = (search?: string) => {
  return useQuery({
    queryKey: orderKeys.list(search),
    queryFn: () => ordersApi.getAll(search),
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersApi.create(payload),
    onSuccess: () => {
      // Інвалідуємо всі запити, пов'язані з orders, щоб оновити списки
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

// export const useUpdateOrder = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: ({ id, payload }: { id: number, payload: any }) => ordersApi.update(id, payload),
//         onSuccess: (_, variables) => {
//             queryClient.invalidateQueries({ queryKey: orderKeys.all });
//             queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
//         },
//     });
// };

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // ... (mutationFn залишається вашим)
    mutationFn: (id: number) => ordersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};
