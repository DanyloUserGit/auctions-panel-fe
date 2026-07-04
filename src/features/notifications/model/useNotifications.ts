import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchGroupRequirements,
  fetchMyAdminGroups,
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
  const query = useQuery({
    queryKey: ['notifications_settings'],
    queryFn: async () => {
      const data = await fetchNotificationsSettings();
      return Array.isArray(data)
        ? data.sort((a, b) => a.id.localeCompare(b.id))
        : data;
    },
  });

  return query;
};
export const useUpdateNotificationsSettings = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isError, error, isPending } = useMutation({
    mutationFn: (data: UpdateNotificationSettings) =>
      updateNotificationsSettings(data),
    mutationKey: ['notifications_settings'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications_settings'] });
    },
  });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications_settings'] });
  };
  return {
    refresh,
    mutate,
    mutateAsync,
    isError,
    error,
    isPending,
  };
};
interface UpdateNotificationsRequirementsProps {
  id: string;
  data: { typeId: string; isMandatory: boolean };
}
export const useUpdateNotificationsRequirements = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isError, error, isPending } = useMutation({
    mutationFn: (data: UpdateNotificationsRequirementsProps) =>
      updateNotificationsRequirements(data.id, data.data),
    mutationKey: ['notifications_requirements'],
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notifications_settings'] });
      queryClient.invalidateQueries({
        queryKey: ['group_requirements', variables.id],
      });
    },
  });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications_settings'] });
  };
  return {
    refresh,
    mutate,
    mutateAsync,
    isError,
    error,
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

export const useMyAdminGroups = () => {
  return useQuery({
    queryKey: ['my_admin_groups'],
    queryFn: fetchMyAdminGroups,
  });
};

export const useGroupRequirements = (groupId?: string) => {
  return useQuery({
    queryKey: ['group_requirements', groupId],
    queryFn: () => fetchGroupRequirements(groupId as string),
    enabled: !!groupId,
  });
};