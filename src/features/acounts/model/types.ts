export interface AccountCreate {
  email: string;
  password: string;
  auctionId: string;
}
export interface AccountUpdate {
  email?: string;
  password?: string;
  auctionId?: string;
}
export interface Account {
  id: string;
  email: string;
  password: string;
  auctionId: string;
}
