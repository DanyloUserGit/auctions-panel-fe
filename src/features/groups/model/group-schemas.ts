

export interface Group {
    id: string;
    title: string;
}
export interface GroupCreate {
    title: string;
    auctions: string[];
}
export interface GroupEdit {
    title?: string;
    auctions?: string[];
}