import type { Socket } from 'socket.io-client';
import { notificationSocket, socket } from '../../../shared/http';
import { initAuth } from '../../auth/model/useAuth';
import type {
  AuctionSocketEvents,
  NotificationSocketEvents,
  SessionConnectData,
} from './types';

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

export const ensureSocketConnected = () => {
  if (!socket.active) {
    socket.connect();
  }
};

export const emitJoinAuction = (sessionConnectData: SessionConnectData) => {
  socket.emit('join_auction', sessionConnectData);
};

export const sendWebRTCOffer = (
  userId: string,
  sessionId: string,
  offer: RTCSessionDescriptionInit,
  width: number,
  height: number,
) => {
  socket.emit('webrtc_signal', {
    userId,
    sessionId: sessionId,
    signalData: { type: 'offer', sdp: offer.sdp },
    width: width,
    height: height,
  });
};
export const subscribeToAuctionEvents = (events: AuctionSocketEvents) => {
  socket.on('connect', events.onConnect);
  socket.on('session_ready', events.onSessionReady);
  socket.on('webrtc_signal_from_worker', events.onSignalFromWorker);
  socket.on('error', events.onError);

  return () => {
    socket.off('connect', events.onConnect);
    socket.off('session_ready', events.onSessionReady);
    socket.off('webrtc_signal_from_worker', events.onSignalFromWorker);
    socket.off('error', events.onError);
  };
};
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

export const subscribeToGlobalNotifications = (
  events: NotificationSocketEvents,
) => {
  notificationSocket.on('new_notification', events.onReceived);

  return () => {
    notificationSocket.off('new_notification', events.onReceived);
  };
};

export const sendWebRTCIceCandidate = (
  sessionId: string,
  candidate: RTCIceCandidate,
) => {
  socket.emit('webrtc_signal', {
    sessionId: sessionId,
    signalData: { type: 'candidate', candidate: candidate },
  });
};
