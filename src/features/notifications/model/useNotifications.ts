import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications } from './api';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryFn: fetchNotifications,
    queryKey: ['notifications'],
  });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };
  return {
    ...query,
    refresh,
  };
};
