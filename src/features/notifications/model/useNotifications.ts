import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotifications,
  fetchNotificationsSettings,
  markAsRead,
  updateNotificationsRequirements,
  updateNotificationsSettings,
} from './api';
import type { UpdateNotificationSettings } from './types';

export const useNotifications = (page: string = '1', limit: string = '20') => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: () => fetchNotifications({ page, limit }),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };
  return {
    ...query,
    refresh,
  };
};

export const useNotificationsSettings = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications_settings'],
    queryFn: () => fetchNotificationsSettings(),
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications_settings'] });
  };
  return {
    ...query,
    refresh,
  };
};
export const useUpdateNotificationsSettings = () => {
  const queryClient = useQueryClient();

  const { mutate, isError, isPending } = useMutation({
    mutationFn: (data: UpdateNotificationSettings) =>
      updateNotificationsSettings(data),
    mutationKey: ['notifications_settings'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-settings'] });
    },
  });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications_settings'] });
  };
  return {
    refresh,
    mutate,
    isError,
    isPending,
  };
};
export const useUpdateNotificationsRequirements = () => {
  const queryClient = useQueryClient();

  const { mutate, isError, isPending } = useMutation({
    mutationFn: (data: {
      id: string;
      data: { typeId: string; isMandatory: boolean };
    }) => updateNotificationsRequirements(data.id, data.data),
    mutationKey: ['notifications_settings'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-settings'] });
    },
  });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications_settings'] });
  };
  return {
    refresh,
    mutate,
    isError,
    isPending,
  };
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Помилка при позначенні як прочитане:', error);
    },
  });
};
