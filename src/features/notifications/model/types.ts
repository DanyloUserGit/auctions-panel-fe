export type NotificationChannel = 'InApp' | 'Email';

export interface NotificationTypeInfo {
  id: string;
  name: string;
  description: string;
}

export interface NotificationSetting {
  id: string;
  userId: string;
  notificationTypeId: string;
  isEnabled: boolean;
  channels: NotificationChannel[];
  notificationType: NotificationTypeInfo;
  isMandatory: boolean;
}
export interface UpdateNotificationSettings {
  typeId: string;
  isEnabled: boolean;
  channels: NotificationChannel[];
}
export interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}
export interface fetchNotificationsResponce {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}
