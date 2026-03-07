import type { Auction } from "../../auctions/model/types";


export interface Group {
    id: string;
    title: string;
    groupAdminId: string;
    auctions: Auction[]
}
export interface GroupCreate {
    title: string;
    auctions: string[];
    groupAdminId: string | null;
}
export interface GroupEdit {
    id?: string;
    title?: string;
    auctions?: string[];
    groupAdminId?: string;
}