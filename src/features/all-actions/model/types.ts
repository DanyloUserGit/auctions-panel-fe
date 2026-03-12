import type { Auction } from "../../auctions/model/types";

export interface SessionLog {
    id: string;
    endedBy: { id: string; email: string };
    auction: Auction;
    time: string;
    isActive: boolean;
    group?: string;
    endedAt: string;
}