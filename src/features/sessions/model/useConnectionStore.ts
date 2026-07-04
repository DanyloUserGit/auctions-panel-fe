import { create } from 'zustand';
import { socket } from '../../../shared/http';
import {
    emitJoinAuction,
    sendWebRTCIceCandidate,
    sendWebRTCOffer,
    subscribeToAuctionEvents,
} from './sockets';

interface SessionConnection {
    originalKey?: string;
    peerConnection: RTCPeerConnection | null;
    dataChannel: RTCDataChannel | null;
    stream: MediaStream | null;
    isLoading: boolean;
    unsubscribeSockets: (() => void) | null;
}

interface ConnectionStore {
    connections: Record<string, SessionConnection>;
    connectToSession: (
        connectionKey: string,
        userId: string,
        sessionConnect: any,
        isNewSession: boolean,
        onRealIdReceived?: (realId: string) => void
    ) => void;
    disconnectFromSession: (sessionId: string) => void;
    disconnectAll: () => void;
    sendInteraction: (sessionId: string, action: object) => void;
}

export const useConnectionStore = create<ConnectionStore>((set, get) => ({
    connections: {},

    connectToSession: (connectionKey, userId, sessionConnect, isNewSession, onRealIdReceived) => {
        if (!connectionKey || get().connections[connectionKey]) {
            return;
        }

        const isAlreadyRenamed = Object.values(get().connections).some(
            (conn) => conn.originalKey === connectionKey
        );
        if (isAlreadyRenamed) {
            return;
        }
        const payload: any = { ...sessionConnect, userId };
        if (!isNewSession) {
            payload.sessionId = connectionKey;
        }

        // let hasJoined = false;
        const iceCandidatesQueue: RTCIceCandidateInit[] = [];

        let currentStoreKey = connectionKey;
        let hasRedirected = false;
        set((state) => ({
            connections: {
                ...state.connections,
                [currentStoreKey]: {
                    originalKey: connectionKey,
                    peerConnection: null,
                    dataChannel: null,
                    stream: null,
                    isLoading: true,
                    unsubscribeSockets: null,
                },
            },
        }));

        const safeJoinAuction = () => {
            // Робимо копію оригінального payload
            const activePayload = { ...payload };

            // currentStoreKey спочатку містить 'pending_...', а потім реальний UUID.
            // Якщо це вже не тимчасовий ключ, обов'язково передаємо його як sessionId!
            if (currentStoreKey && !currentStoreKey.startsWith('pending_')) {
                activePayload.sessionId = currentStoreKey;
            }

            // Відправляємо актуальні дані
            emitJoinAuction(activePayload);
        };

        const unsubscribeSockets = subscribeToAuctionEvents({
            onConnect: () => {
                safeJoinAuction();
            },

            onSessionReady: async (data) => {
                const realSessionId = data.sessionId;

                // 1. Якщо це була нова сесія і бекенд повернув реальний ID
                if (isNewSession && realSessionId && !hasRedirected) {
                    hasRedirected = true;

                    const oldKey = currentStoreKey;
                    currentStoreKey = realSessionId;

                    set((state) => {
                        const newConnections = { ...state.connections };
                        if (newConnections[oldKey]) {
                            newConnections[currentStoreKey] = newConnections[oldKey];
                            delete newConnections[oldKey];
                        }
                        return { connections: newConnections };
                    });

                    if (onRealIdReceived) {
                        onRealIdReceived(realSessionId);
                    }
                }
                const existingConnection = get().connections[currentStoreKey];
                if (existingConnection?.peerConnection) {
                    console.log('📍 WebRTC вже ініціалізовано, пропускаємо повторне створення.');
                    return;
                }

                // 2. ВАЖЛИВО: Далі завжди працюємо з `currentStoreKey` замість `sessionId`
                const pc = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
                });

                pc.oniceconnectionstatechange = () => {
                    console.log('📍 ICE стан:', pc.iceConnectionState);
                };

                pc.addTransceiver('video', { direction: 'recvonly' });

                const dataChannel = pc.createDataChannel('interact');

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        sendWebRTCIceCandidate(currentStoreKey, event.candidate);
                    }
                };

                pc.ontrack = (event) => {
                    const track = event.track;
                    console.log('✅ Отримано трек:', track.kind);

                    const stream = event.streams && event.streams[0]
                        ? event.streams[0]
                        : new MediaStream([track]);

                    set((state) => ({
                        connections: {
                            ...state.connections,
                            [currentStoreKey]: {
                                ...state.connections[currentStoreKey],
                                stream: stream,
                            },
                        },
                    }));

                    track.onunmute = () => {
                        set((state) => ({
                            connections: {
                                ...state.connections,
                                [currentStoreKey]: {
                                    ...state.connections[currentStoreKey],
                                    isLoading: false,
                                },
                            },
                        }));
                    };
                };

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                sendWebRTCOffer(
                    userId,
                    currentStoreKey,
                    offer,
                    sessionConnect.width,
                    sessionConnect.height
                );

                set((state) => ({
                    connections: {
                        ...state.connections,
                        [currentStoreKey]: {
                            ...state.connections[currentStoreKey],
                            peerConnection: pc,
                            dataChannel: dataChannel,
                        },
                    },
                }));
            },

            onSignalFromWorker: async (signalData) => {
                // Якщо бекенд прислав ID, беремо його, якщо ні - беремо наш актуальний ключ
                const targetId = (signalData as any).sessionId || currentStoreKey;
                const pc = get().connections[targetId]?.peerConnection;
                if (!pc) return;

                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                const fallbackVpsIp = '155.117.43.95';
                const TARGET_IP = isLocalhost ? '127.0.0.1' : fallbackVpsIp;

                try {
                    if (signalData.type === 'answer') {
                        let sdp = (signalData as RTCSessionDescriptionInit).sdp;
                        if (sdp) sdp = sdp.replace(/(172|192|10)\.\d+\.\d+\.\d+/g, TARGET_IP);

                        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));

                        while (iceCandidatesQueue.length > 0) {
                            const candidate = iceCandidatesQueue.shift();
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
                            iceCandidatesQueue.push(candidateInit);
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
            safeJoinAuction();
        }

        set((state) => ({
            connections: {
                ...state.connections,
                [currentStoreKey]: {
                    ...state.connections[currentStoreKey],
                    unsubscribeSockets,
                },
            },
        }));
    },

    disconnectFromSession: (sessionId) => {
        const connection = get().connections[sessionId];
        if (!connection) return;

        if (connection.unsubscribeSockets) connection.unsubscribeSockets();
        if (connection.stream) connection.stream.getTracks().forEach((track) => track.stop());
        if (connection.dataChannel) connection.dataChannel.close();
        if (connection.peerConnection) {
            connection.peerConnection.getReceivers().forEach((receiver) => {
                if (receiver.track) receiver.track.stop();
            });
            connection.peerConnection.close();
        }

        // Не шлемо на бекенд pending_ ключ — реальної сесії ще могло не бути
        if (socket.connected && !sessionId.startsWith('pending_')) {
            socket.emit('leave_auction', { sessionId });
        }

        set((state) => {
            const newConnections = { ...state.connections };
            delete newConnections[sessionId];
            return { connections: newConnections };
        });
    },

    disconnectAll: () => {
        const allConnections = get().connections;

        Object.entries(allConnections).forEach(([sessionId, connection]) => {
            if (connection.unsubscribeSockets) connection.unsubscribeSockets();
            if (connection.stream) connection.stream.getTracks().forEach((track) => track.stop());
            if (connection.dataChannel) connection.dataChannel.close();
            if (connection.peerConnection) {
                connection.peerConnection.getReceivers().forEach((receiver) => {
                    if (receiver.track) receiver.track.stop();
                });
                connection.peerConnection.close();
            }

            // Не шлемо pending_ ключі на бекенд — це ще не реальний sessionId
            if (socket.connected && !sessionId.startsWith('pending_')) {
                socket.emit('leave_auction', { sessionId });
            }
        });

        set({ connections: {} });
    },

    sendInteraction: (sessionId, action) => {
        const dc = get().connections[sessionId]?.dataChannel;
        if (dc?.readyState === 'open') {
            dc.send(JSON.stringify(action));
        }
    },
}));