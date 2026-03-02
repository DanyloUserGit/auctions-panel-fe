import type { Account } from "../../acounts/model/types";
import type { Auction } from "../../auctions/model/types";
import type { User } from "../../auth/model/user-schema";

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

export interface Session {
    id: string;

    maxConnections: number;
    activeConnections: number;
    isActive: boolean;

    auction: Auction;

    account: Account;

    users: User[];

    expiresAt: string;
    createdAt: string;

    workerId?: string | null;
    worker?: Worker | null;
}