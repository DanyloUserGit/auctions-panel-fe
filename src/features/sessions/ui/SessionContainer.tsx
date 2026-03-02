import { useEffect, useRef, useState, type FC, type KeyboardEvent, type MouseEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../../shared/http';
import { useAuth } from '../../auth/model/useAuth';
import { emitJoinAuction, sendWebRTCIceCandidate, sendWebRTCOffer, subscribeToAuctionEvents } from '../model/sockets';
import { useSession } from '../model/store';

export const SessionContainer: FC = () => {
    const { sessionId } = useParams<{ sessionId?: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const hasJoined = useRef(false);
    const sessionConnect = useSession();

    const videoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);

    const [status, setStatus] = useState<string>("Ініціалізація");

    useEffect(() => {
        if (!user?.id) return;

        if (!sessionId && !sessionConnect.auctionId) {
            console.warn("Немає даних для підключення чи створення сесії.");
            navigate('/');
            return;
        }

        // Встановлюємо початковий статус
        setStatus(sessionId ? "Підключення до сесії..." : "Створення нової сесії...");

        const payload = sessionId
            ? { ...sessionConnect, sessionId, userId: user.id }
            : { ...sessionConnect, userId: user.id };

        const safeJoinAuction = (payload: any) => {
            if (!hasJoined.current) {
                hasJoined.current = true;
                emitJoinAuction(payload);
            }
        };

        // 1. СПОЧАТКУ ПІДПИСУЄМОСЬ НА ПОДІЇ (щоб не пропустити швидку відповідь сервера)
        const unsubscribeSockets = subscribeToAuctionEvents({
            onConnect: () => {
                safeJoinAuction(payload);
            },

            onSessionReady: async (data) => {
                setStatus('Налаштування відеозв\'язку...');

                // 2. ФІКС МАРШРУТИЗАЦІЇ: Змінюємо URL непомітно для React
                if (!sessionId && data.sessionId) {
                    // window.history.replaceState не викликає ререндер, але змінює рядок в браузері
                    window.history.replaceState(null, '', `/session/${data.sessionId}`);
                }

                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });
                peerConnectionRef.current = pc;
                pc.onconnectionstatechange = () => console.log("🚀 Стан WebRTC:", pc.connectionState);

                const dataChannel = pc.createDataChannel('interact');
                dataChannelRef.current = dataChannel;

                dataChannel.onopen = () => console.log('DataChannel відкрито для передачі подій');
                dataChannel.onclose = () => console.log('DataChannel закрито');

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        sendWebRTCIceCandidate(data.sessionId, event.candidate);
                    }
                };

                pc.ontrack = (event) => {
                    console.log('Отримано відеопотік', event.track);
                    if (videoRef.current) {
                        const stream = event.streams && event.streams.length > 0
                            ? event.streams[0]
                            : new MediaStream([event.track]);

                        videoRef.current.srcObject = stream;

                        videoRef.current.play().catch(e => console.error("Не вдалося запустити відео:", e));

                        setStatus('Активна сесія 🟢');
                    }
                };

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                sendWebRTCOffer(data.sessionId, offer, sessionConnect.width, sessionConnect.height);
            },

            onSignalFromWorker: async (signalData) => {
                const pc = peerConnectionRef.current;
                if (!pc) return;

                if (signalData.type === 'answer' || signalData.type === 'offer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(signalData as RTCSessionDescriptionInit));
                    console.log('Відеозв\'язок встановлено (Answer отримано)');
                } else if (signalData.type === 'candidate' && signalData.candidate) {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(signalData.candidate));
                    } catch (e) {
                        console.error('Помилка додавання ICE кандидата', e);
                    }
                }
            },

            onError: (err) => {
                setStatus(`Помилка: ${err.message}`);
            }
        });

        // 3. ВІДПРАВЛЯЄМО ЗАПИТ ТІЛЬКИ ПІСЛЯ ПІДПИСКИ
        if (socket.connected) {
            safeJoinAuction(payload);
        }

        return () => {
            unsubscribeSockets();
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
        };
    }, [user?.id, sessionId, sessionConnect, navigate]);

    const sendInteraction = (action: object) => {
        if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
            dataChannelRef.current.send(JSON.stringify(action));
        }
    };

    const handleMouseClick = (e: MouseEvent<HTMLVideoElement>) => {
        const rect = videoRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        sendInteraction({ type: 'click', x, y });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        sendInteraction({ type: 'keydown', key: e.key });
    };

    return (
        <div
            className="relative w-full h-full bg-black min-h-screen outline-none"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                {status}
            </div>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onClick={handleMouseClick}
                className="w-full h-full object-contain cursor-crosshair"
            />
        </div>
    );
};