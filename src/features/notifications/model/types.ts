export type NotificationChannel = 'InApp' | 'Email' | 'Telegram' | 'Viber';

export interface NotificationTypeSetting {
  min: number;
  max: number;
  default: number;
}

export interface NotificationType {
  id: string;
  name: string;
  description: string;
  configType: 'Configurable' | 'System';
  setting?: NotificationTypeSetting | null;
}

export interface NotificationSetting {
  id: string;
  userId: string;
  notificationTypeId: string;
  isEnabled: boolean;
  isMandatory: boolean;
  value?: number | null;
  channels: NotificationChannel[];
  notificationType: NotificationType;
}

export interface UpdateNotificationSettings {
  typeId: string;
  isEnabled?: boolean;
  channels?: NotificationChannel[];
  value?: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface fetchNotificationsResponce {
  data: NotificationItem[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

export interface GroupRequirement {
  typeId: string;
  name: string;
  description: string;
  isMandatory: boolean;
}

export interface AdminGroup {
  id: string;
  title: string;
}