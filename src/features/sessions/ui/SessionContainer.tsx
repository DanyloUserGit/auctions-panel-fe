import { useEffect, useRef, useState, type FC, type KeyboardEvent, type MouseEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);

    const [status, setStatus] = useState<string>("Ініціалізація");

    useEffect(() => {
        if (!user?.id) return;

        if (!sessionId && !sessionConnect.auctionId) {
            console.warn("Немає даних для підключення чи створення сесії.");
            navigate('/');
            return;
        }

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

        const unsubscribeSockets = subscribeToAuctionEvents({
            onConnect: () => {
                safeJoinAuction(payload);
            },

            onSessionReady: async (data) => {
                setStatus('Налаштування відеозв\'язку...');

                if (!sessionId && data.sessionId) {
                    window.history.replaceState(null, '', `/session/${data.sessionId}`);
                }

                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });
                peerConnectionRef.current = pc;

                pc.oniceconnectionstatechange = () => {
                    console.log("📍 ICE стан:", pc.iceConnectionState);
                    if (pc.iceConnectionState === 'failed') setStatus("Помилка мережі (ICE Failed)");
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

                    track.onunmute = () => {
                        console.log('🎉 Дані відео почали надходити!');
                        setStatus('Активна сесія 🟢');
                    };

                    if (videoRef.current && event.streams[0]) {
                        videoRef.current.srcObject = event.streams[0];
                    }
                };

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                sendWebRTCOffer(data.sessionId, offer, sessionConnect.width, sessionConnect.height);
            },

            onSignalFromWorker: async (signalData) => {
                const pc = peerConnectionRef.current;
                if (!pc) return;

                // ДИНАМІЧНЕ ВИЗНАЧЕННЯ IP (Локально чи VPS)
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

                // Вставте сюди публічний IP вашого Ubuntu сервера замість 198.51.100.25 !!!
                // Або використовуйте .env змінну, якщо вона налаштована (наприклад VITE_VPS_IP)
                // @ts-ignore
                const fallbackVpsIp = '155.117.43.95';

                const TARGET_IP = isLocalhost ? '127.0.0.1' : fallbackVpsIp;

                try {
                    if (signalData.type === 'answer') {
                        let sdp = (signalData as RTCSessionDescriptionInit).sdp;
                        if (sdp) {
                            sdp = sdp.replace(/(172|192|10)\.\d+\.\d+\.\d+/g, TARGET_IP);
                        }
                        const patchedAnswer = { type: 'answer' as RTCSdpType, sdp };

                        await pc.setRemoteDescription(new RTCSessionDescription(patchedAnswer));
                        console.log(`✅ Remote Description встановлено (Підключення до: ${TARGET_IP})`);

                        while (iceCandidatesQueue.current.length > 0) {
                            const candidate = iceCandidatesQueue.current.shift();
                            if (candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
                        }
                    } else if (signalData.type === 'candidate' && 'candidate' in signalData) {
                        const candidateInit = { ...signalData.candidate };
                        if (candidateInit.candidate) {
                            candidateInit.candidate = candidateInit.candidate.replace(/(172|192|10)\.\d+\.\d+\.\d+/g, TARGET_IP);
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
                setStatus(`Помилка: ${err.message}`);
            }
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
                controls={false}
                onClick={handleMouseClick}
                className="w-full h-full object-contain cursor-crosshair"
            />
        </div>
    );
};