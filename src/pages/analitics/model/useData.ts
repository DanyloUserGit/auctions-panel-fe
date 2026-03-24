import { useQuery } from '@tanstack/react-query';
import { fetchCarAnalytics } from './api';
import type { CarAnalytics } from './types';

export const useData = (carId: number | null) => {
  return useQuery<CarAnalytics, Error>({
    queryKey: ['carAnalytics', carId],
    queryFn: () => fetchCarAnalytics(carId!),
    enabled: !!carId,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};
