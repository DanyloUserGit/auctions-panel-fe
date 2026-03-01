import type { Auction } from "../../auctions/model/types";


export interface Group {
    id: string;
    title: string;
    auctions: Auction[]
}
export interface GroupCreate {
    title: string;
    auctions: string[];
}
export interface GroupEdit {
    title?: string;
    auctions?: string[];
}