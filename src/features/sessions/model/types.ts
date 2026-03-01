export type SessionConnectData = {
    auctionId: string,
    auctionAuthId: string,
    width: number,
    height: number
}
export type WebRTCSignalData = 
    | RTCSessionDescriptionInit 
    | { type: 'candidate'; candidate: RTCIceCandidateInit };

export interface AuctionSocketEvents {
    onConnect: () => void;
    onSessionReady: (data: { sessionId: string }) => void;
    onSignalFromWorker: (signalData: WebRTCSignalData) => void; 
    onError: (err: { message: string }) => void;
}