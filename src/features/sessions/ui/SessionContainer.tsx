import { ArrowBack } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import throttle from 'lodash/throttle';
import { useEffect, useRef, useState, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from '../../../shared/http';
import { Loader } from '../../../shared/ui/Loader';
import { useAuth } from '../../auth/model/useAuth';
import {
  emitJoinAuction,
  sendWebRTCIceCandidate,
  sendWebRTCOffer,
  subscribeToAuctionEvents,
} from '../model/sockets';
import { useSession } from '../model/store';
import type { SessionConnectData } from '../model/types';
import { useTabsStore } from '../model/useTabsStore';

export const SessionContainer: FC = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const hasJoined = useRef(false);
  const sessionConnect = useSession();

  const { addTab, tabs } = useTabsStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;

    if (!sessionId && !sessionConnect.auctionId) {
      console.warn('Немає даних для підключення чи створення сесії.');
      navigate('/');
      return;
    }

    if (sessionId && !tabs.find((item) => item.id == sessionId)) {
      addTab({
        id: sessionId,
        key: (tabs.length + 1).toString(),
        title: `Вкладка ${tabs.length + 1}`,
      });
    }

    const payload = sessionId
      ? { ...sessionConnect, sessionId, userId: user.id }
      : { ...sessionConnect, userId: user.id };

    const safeJoinAuction = (payload: SessionConnectData) => {
      if (!hasJoined.current) {
        hasJoined.current = true;
        emitJoinAuction(payload);
      }
    };

    const unsubscribeSockets = subscribeToAuctionEvents({
      onConnect: () => {
        safeJoinAuction(payload);
      },

      onSessionReady: async (data) => {
        if (!sessionId && data.sessionId) {
          window.history.replaceState(null, '', `/session/${data.sessionId}`);
        }

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });
        peerConnectionRef.current = pc;

        pc.oniceconnectionstatechange = () => {
          console.log('📍 ICE стан:', pc.iceConnectionState);
        };

        pc.addTransceiver('video', { direction: 'recvonly' });

        const dataChannel = pc.createDataChannel('interact');
        dataChannelRef.current = dataChannel;

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            sendWebRTCIceCandidate(data.sessionId, event.candidate);
          }
        };

        pc.ontrack = (event) => {
          const track = event.track;
          console.log('✅ Отримано трек:', track.kind);

          if (videoRef.current) {
            videoRef.current.srcObject =
              event.streams && event.streams[0]
                ? event.streams[0]
                : new MediaStream([track]);
          }

          track.onunmute = () => {
            setIsLoading(false);

            if (videoRef.current) {
              videoRef.current.play().catch((err) => {
                console.warn('Автоплей заблоковано браузером:', err);
              });
            }
          };
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendWebRTCOffer(
          user.id,
          data.sessionId,
          offer,
          sessionConnect.width,
          sessionConnect.height,
        );
      },

      onSignalFromWorker: async (signalData) => {
        const pc = peerConnectionRef.current;
        if (!pc) return;

        // ДИНАМІЧНЕ ВИЗНАЧЕННЯ IP (Локально чи VPS)
        const isLocalhost =
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1';

        // Вставте сюди публічний IP вашого Ubuntu сервера замість 198.51.100.25 !!!
        // Або використовуйте .env змінну, якщо вона налаштована (наприклад VITE_VPS_IP)

        const fallbackVpsIp = '155.117.43.95';

        const TARGET_IP = isLocalhost ? '127.0.0.1' : fallbackVpsIp;

        try {
          if (signalData.type === 'answer') {
            let sdp = (signalData as RTCSessionDescriptionInit).sdp;
            if (sdp) {
              sdp = sdp.replace(/(172|192|10)\.\d+\.\d+\.\d+/g, TARGET_IP);
            }
            const patchedAnswer = { type: 'answer' as RTCSdpType, sdp };

            await pc.setRemoteDescription(
              new RTCSessionDescription(patchedAnswer),
            );
            console.log(
              `✅ Remote Description встановлено (Підключення до: ${TARGET_IP})`,
            );

            while (iceCandidatesQueue.current.length > 0) {
              const candidate = iceCandidatesQueue.current.shift();
              if (candidate)
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
          } else if (
            signalData.type === 'candidate' &&
            'candidate' in signalData
          ) {
            const candidateInit = { ...signalData.candidate };
            if (candidateInit.candidate) {
              candidateInit.candidate = candidateInit.candidate.replace(
                /(172|192|10)\.\d+\.\d+\.\d+/g,
                TARGET_IP,
              );
            }

            if (pc.remoteDescription) {
              await pc.addIceCandidate(new RTCIceCandidate(candidateInit));
            } else {
              iceCandidatesQueue.current.push(candidateInit);
            }
          }
        } catch (e) {
          console.error('❌ Помилка WebRTC сигналу:', e);
        }
      },

      onError: (err) => {
        console.log(`Помилка: ${err.message}`);
      },
    });

    if (socket.connected) {
      safeJoinAuction(payload);
    }

    return () => {
      unsubscribeSockets();
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      if (socket.connected && sessionId) {
        socket.emit('leave_auction', { sessionId });
      }
    };
  }, [user?.id, sessionId, sessionConnect, navigate]);

  const sendInteraction = (action: object) => {
    if (dataChannelRef.current?.readyState === 'open') {
      dataChannelRef.current.send(JSON.stringify(action));
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.WheelEvent) => {
    const rect = videoRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };
  const throttledMouseMoveRef = useRef<ReturnType<typeof throttle> | null>(
    null,
  );

  useEffect(() => {
    throttledMouseMoveRef.current = throttle(
      (coords: { x: number; y: number }) => {
        if (dataChannelRef.current?.readyState === 'open') {
          dataChannelRef.current.send(
            JSON.stringify({ type: 'mousemove', ...coords }),
          );
        }
      },
      50,
    );

    return () => {
      throttledMouseMoveRef.current?.cancel();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLVideoElement>) => {
    throttledMouseMoveRef.current?.(getCoordinates(e));
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLVideoElement>) => {
    sendInteraction({
      type: 'mousedown',
      ...getCoordinates(e),
      button: e.button,
    });
    videoRef.current?.focus();
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLVideoElement>) => {
    sendInteraction({
      type: 'mouseup',
      ...getCoordinates(e),
      button: e.button,
    });
  };

  const handleWheel = (e: React.WheelEvent<HTMLVideoElement>) => {
    sendInteraction({ type: 'wheel', deltaX: e.deltaX, deltaY: e.deltaY });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    sendInteraction({ type: 'keydown', key: e.key });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    sendInteraction({ type: 'keyup', key: e.key });
  };
  return (
    <div
      className="relative w-full h-full bg-transparent min-h-screen outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {isLoading && <Loader />}
      <div className="fixed">
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ color: 'text.secondary', backgroundColor: 'white' }}
        >
          <ArrowBack />
        </IconButton>
      </div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        controls={false}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className={`w-full h-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};
