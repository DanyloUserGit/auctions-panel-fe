import { api } from '../../../shared/http';
import type {
  fetchNotificationsResponce,
  NotificationSetting,
  UpdateNotificationSettings,
} from './types';

export const fetchNotifications = async ({
  page = '1',
  limit = '20',
} = {}): Promise<fetchNotificationsResponce> => {
  const response = await api.get(`/notifications`, {
    params: { page, limit },
  });

  return response.data;
};
export const fetchNotificationsSettings = async (): Promise<
  NotificationSetting[]
> => {
  const response = await api.get(`/notifications/settings`);
  return response.data;
};
export const updateNotificationsSettings = async (
  data: UpdateNotificationSettings,
) => {
  const response = await api.patch(`/notifications/settings`, data);
  return response.data;
};
export const updateNotificationsRequirements = async (
  id: string,
  data: { typeId: string; isMandatory: boolean },
) => {
  if (!id) return;
  const response = await api.patch(
    `/notifications/group/${id}/requirements`,
    data,
  );
  return response.data;
};
export const markAsRead = async (id: string) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};
