import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createInStockCar,
  fetchInStockCars,
  sellInStockCar,
  updateInStockCar,
  type CarFilters,
  type CarsResponse,
} from './api';

const inStockKey = ['in-stock-cars'] as const;

export const useInStockCars = (filters: CarFilters) => {
  return useQuery<CarsResponse, Error>({
    queryKey: [...inStockKey, filters],
    queryFn: () => fetchInStockCars(filters),
    placeholderData: keepPreviousData,
  });
};

const useInvalidatingMutation = <TArgs, TResult>(mutationFn: (args: TArgs) => Promise<TResult>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inStockKey }),
  });
};

export const useCreateCar = () => useInvalidatingMutation(createInStockCar);
export const useUpdateCar = () => useInvalidatingMutation(updateInStockCar);
export const useSellCar = () => useInvalidatingMutation(sellInStockCar);
