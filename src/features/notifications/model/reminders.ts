import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/http';

export interface AuctionReminder {
  id: string;
  title: string;
  url?: string | null;
  endsAt: string;
  remindAt: string;
  sentAt?: string | null;
}

const key = ['notification-reminders'] as const;

export const useReminders = () =>
  useQuery({ queryKey: key, queryFn: async () => (await api.get<AuctionReminder[]>('/notifications/reminders')).data });

export const useCreateReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; url?: string; endsAt: string }) => (await api.post('/notifications/reminders', data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};

export const useDeleteReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete(`/notifications/reminders/${id}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};
