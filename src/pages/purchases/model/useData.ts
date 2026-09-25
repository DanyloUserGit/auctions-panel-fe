import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchasesApi, type UpdateStatusParams } from './api';

export const usePurchasesData = () => {
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['purchases'],
        queryFn: purchasesApi.getPurchases,
    });

    const { mutateAsync: updateStatus, isPending: isUpdating } = useMutation({
        mutationFn: (params: UpdateStatusParams) => purchasesApi.updateStatus(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchases'] });
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