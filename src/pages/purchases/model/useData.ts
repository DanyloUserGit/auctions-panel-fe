// useData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchasesApi, type UpdateStatusParams } from './api';

export const usePurchasesData = (dbName: string) => {
    const queryClient = useQueryClient();

    // GET: Отримання автомобілів та статистики
    const {
        data,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['purchases', dbName],
        queryFn: () => purchasesApi.getPurchases(dbName),
        enabled: !!dbName, // Запит піде лише тоді, коли є назва БД
    });

    // PATCH: Зміна статусу авто
    const { mutateAsync: updateStatus, isPending: isUpdating } = useMutation({
        mutationFn: (params: UpdateStatusParams) => purchasesApi.updateStatus(params),
        onSuccess: () => {
            // Після успішного оновлення статусу, змушуємо React Query оновити дані
            queryClient.invalidateQueries({ queryKey: ['purchases', dbName] });
        },
    });

    return {
        cars: data?.cars || [],
        stats: data?.stats || null,
        isLoading,
        isError,
        updateStatus,
        isUpdating,
    };
};