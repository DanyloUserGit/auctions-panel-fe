export interface Auction {
    id: string;
    title: string;
    url: string
}
export interface AuctionCreate {
    title: string;
    url: string;
    auctionGroupId: string;
    users?: string[]
}