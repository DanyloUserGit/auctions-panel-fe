import { api } from '../../../shared/http';
import type { UpdateNotificationSettings } from './types';

export const fetchNotifications = async () => {
  const responce = await api.get(`/notifications`);
  console.log(responce.data);
  return responce.data;
};
export const fetchNotificationsSettings = async () => {
  const responce = await api.get(`/notifications/settings`);
  console.log(responce.data);
  return responce.data;
};
export const updateNotificationsSettings = async (
  data: UpdateNotificationSettings,
) => {
  const responce = await api.patch(`/notifications/settings`, data);
  console.log(responce.data);
  return responce.data;
};
export const markAsRead = async (id: string) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};
