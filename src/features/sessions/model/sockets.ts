import type { Socket } from 'socket.io-client';
import { notificationSocket, socket } from '../../../shared/http';
import { initAuth } from '../../auth/model/useAuth';
import type { NotificationSocketEvents } from './types';

// Сервер відключає сокет, якщо access_token відсутній або прострочений.
// Один раз оновлюємо токен і перепідключаємось.
const reconnectAfterTokenRefresh = (target: Socket) => {
  let authRetried = false;
  target.on('connect', () => {
    authRetried = false;
  });
  target.on('disconnect', async (reason) => {
    if (reason !== 'io server disconnect' || authRetried) return;
    authRetried = true;
    if (await initAuth()) {
      target.connect();
    }
  });
};

reconnectAfterTokenRefresh(socket);
reconnectAfterTokenRefresh(notificationSocket);

// Сервер визначає користувача за cookie access_token, userId не передається.
export const connectNotificationSocket = () => {
  if (!notificationSocket.connected) {
    notificationSocket.connect();
  }
};

export const disconnectNotificationSocket = () => {
  if (notificationSocket.connected) {
    notificationSocket.disconnect();
  }
};

export const subscribeToGlobalNotifications = (events: NotificationSocketEvents) => {
  notificationSocket.on('new_notification', events.onReceived);

  return () => {
    notificationSocket.off('new_notification', events.onReceived);
  };
};
