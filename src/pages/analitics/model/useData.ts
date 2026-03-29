import { useState, useEffect } from 'react';
import { fetchAnalyticsByVin } from './api';

export const useAnalyticsData = (vin: string | undefined, dbName: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vin) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const marketData = await fetchAnalyticsByVin(vin, dbName);
        setData(marketData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Помилка завантаження даних');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [vin, dbName]);

  return { data, isLoading, error };
};