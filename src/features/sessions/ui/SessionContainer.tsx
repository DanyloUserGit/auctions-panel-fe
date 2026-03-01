import { useEffect, useRef, useState, type FC } from 'react';
import { socket } from '../../../shared/http';
import { useAuth } from '../../auth/model/useAuth';
import { emitJoinAuction, sendWebRTCOffer, sendWebRTCIceCandidate, subscribeToAuctionEvents } from '../model/sockets';
import { useSession } from '../model/store';

export const SessionContainer: FC = () => {
    const { user } = useAuth();
    const sessionConnect = useSession();

    const videoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    const [status, setStatus] = useState<string>("Ініціалізація");

    useEffect(() => {
        if (!user?.id || !sessionConnect) return;

        setStatus("Пошук сесії");

        if (socket.connected) {
            emitJoinAuction({ ...sessionConnect });
        }

        const unsubscribeSockets = subscribeToAuctionEvents({
            onConnect: () => {
                emitJoinAuction({ ...sessionConnect });
            },

            onSessionReady: async (data) => {
                setStatus('Налаштування відеозв\'язку...');

                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });
                peerConnectionRef.current = pc;

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        sendWebRTCIceCandidate(data.sessionId, event.candidate);
                    }
                };

                pc.ontrack = (event) => {
                    console.log('Отримано потік');
                    if (videoRef.current && event.streams[0]) {
                        videoRef.current.srcObject = event.streams[0];
                        setStatus('Активна сесія');
                    }
                };

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                sendWebRTCOffer(data.sessionId, offer);
            },

            onSignalFromWorker: async (signalData) => {
                const pc = peerConnectionRef.current;
                if (!pc) return;

                if (signalData.type === 'answer' || signalData.type === 'offer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(signalData as RTCSessionDescriptionInit));
                    console.log('Відеозв\'язок встановлено (Answer/Offer отримано)');
                } else if (signalData.type === 'candidate' && signalData.candidate) {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(signalData.candidate));
                        console.log('Додано віддалений ICE кандидат');
                    } catch (e) {
                        console.error('Помилка додавання ICE кандидата', e);
                    }
                }
            },

            onError: (err) => {
                setStatus(`Помилка: ${err.message}`);
                console.error(err.message);
            }
        });

        return () => {
            unsubscribeSockets();

            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
        };
    }, [user?.id, sessionConnect]);

    return (
        <div className="relative w-full h-full bg-black min-h-100">
            <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                {status}
            </div>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
            />
        </div>
    );
};