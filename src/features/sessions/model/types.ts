import type { NotificationItem } from '../../notifications/model/types';

export interface NotificationSocketEvents {
  onReceived: (data: NotificationItem) => void;
  onError: (err: { message: string }) => void;
  onRead?: (data: { id: string }) => void;
}
