import { useState, useEffect } from 'react';
import { fetchAnalyticsByVin, type AnalyticsResponse } from './api';

export const useAnalyticsData = (vin: string | undefined) => {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vin) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const marketData = await fetchAnalyticsByVin(vin);
        setData(marketData);
      } catch (err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        setError(response?.data?.message || 'Помилка завантаження даних');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [vin]);

  return { data, isLoading, error };
};