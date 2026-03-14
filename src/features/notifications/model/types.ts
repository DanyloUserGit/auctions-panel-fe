export interface NotificationSetting {
  id: string;
  type: string;
  inApp: boolean;
  email: boolean;
  telegram: boolean;
  isMandatory: boolean;
}
export interface UpdateNotificationSettings {
  typeId: 'string';
  isEnabled: boolean;
  channels: ['InApp', 'Email'];
}
export interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}
