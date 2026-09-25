export interface AccountCreate {
  email: string;
  password: string;
  auctionId: string;
  title: string;
}
export interface AccountUpdate {
  email?: string;
  title?: string;
  password?: string;
  auctionId?: string;
}
export interface Account {
  id: string;
  title: string;
  // Логін акаунта повертається лише SuperAdmin.
  email?: string;
  password: string;
  auctionId: string;
}
