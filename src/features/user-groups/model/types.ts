export interface AuctionGroupSummary {
  id: string;
  title: string;
}

export interface AuctionSummary {
  id: string;
  title: string;
  url: string;
  auctionGroupId?: string | null;
  auctionGroup?: AuctionGroupSummary | null;
}

export interface AccountSummary {
  id: string;
  title: string;
  // Логін акаунта повертається лише SuperAdmin.
  email?: string;
  auctionId: string;
  auction?: {
    id: string;
    title: string;
    auctionGroupId?: string | null;
    auctionGroup?: AuctionGroupSummary | null;
  } | null;
}

// Група аукціонів із каталогу (GET /auction-groups повертає вкладені аукціони).
export interface CatalogAuctionGroup extends AuctionGroupSummary {
  auctions?: AuctionSummary[];
}

// Дозволи ланцюга група аукціонів → аукціон → акаунт (групи користувачів або окремого користувача).
export interface AccessGrants {
  allowedAuctionGroups: AuctionGroupSummary[];
  allowedAuctions: AuctionSummary[];
  allowedAccounts: AccountSummary[];
}

export type AccessKind = 'auctionGroup' | 'auction' | 'account';

// Особисті доступи користувача + акаунти групи, заборонені саме йому.
export interface PersonalAccess extends AccessGrants {
  deniedAccounts: AccountSummary[];
  // Чи може поточний користувач змінювати заборони (SuperAdmin або GA з canGaManageAccounts).
  canManageDenials: boolean;
}

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserGroup {
  id: string;
  name: string;
  isActive: boolean;

  canGaManageAccounts: boolean;
  showAccounts: boolean;
  rules?: Record<string, any> | null;
  allowedProfileFields: string[];

  lastActivity?: string | null;

  AdminId?: string | null;
  Admin?: UserSummary | null;

  allowedAuctionGroups?: AuctionGroupSummary[];
  allowedAuctions?: AuctionSummary[];
  allowedAccounts?: AccountSummary[];

  usersCount?: number;
  auctionGroupsCount?: number;
  auctionsCount?: number;
  accountsCount?: number;
}

export interface UserGroupCreate {
  name: string;
  canGaManageAccounts?: boolean;
  showAccounts?: boolean;
  rules?: Record<string, any>;
  allowedProfileFields?: string[];
  Admin?: string;
  users?: string[];
}

export type UserGroupEdit = Partial<UserGroupCreate>;