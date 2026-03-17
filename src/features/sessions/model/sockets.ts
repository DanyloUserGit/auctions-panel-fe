import { notificationSocket, socket } from '../../../shared/http';
import type {
  AuctionSocketEvents,
  NotificationSocketEvents,
  SessionConnectData,
} from './types';

export const emitJoinAuction = (sessionConnectData: SessionConnectData) => {
  socket.emit('join_auction', sessionConnectData);
};

export const sendWebRTCOffer = (
  sessionId: string,
  offer: RTCSessionDescriptionInit,
  width: number,
  height: number,
) => {
  socket.emit('webrtc_signal', {
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
export const connectNotificationSocket = (userId: string) => {
  if (!notificationSocket.connected) {
    notificationSocket.io.opts.query = { userId };
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
