import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createInStockCar, fetchInStockCars, updateInStockCar, type Car } from './api';

export const useInStockCars = () => {
  return useQuery<Car[], Error>({
    queryKey: ['in-stock-cars'],
    queryFn: fetchInStockCars,
    staleTime: 1000 * 60 * 5,
  });
};

// Хук для створення
export const useCreateCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInStockCar,
    onSuccess: () => {
      // Автоматичне оновлення списку після успішного створення
      queryClient.invalidateQueries({ queryKey: ['in-stock-cars'] });
    },
  });
};

// Хук для оновлення
export const useUpdateCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInStockCar,
    onSuccess: () => {
      // Автоматичне оновлення списку після успішного редагування
      queryClient.invalidateQueries({ queryKey: ['in-stock-cars'] });
    },
  });
};