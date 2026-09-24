import { api } from '../../../shared/http';
import type { User } from '../../auth/model/user-schema';
import type {
  AccessKind,
  AccountSummary,
  AuctionSummary,
  CatalogAuctionGroup,
  PersonalAccess,
  UserGroup,
  UserGroupCreate,
  UserGroupEdit,
  UserSummary,
} from './types';


export const fetchUserGroups = async (): Promise<UserGroup[]> => {
  const response = await api.get('/user-groups');
  return response.data;
};

export const fetchUserGroupsByQuery = async (q: string): Promise<UserGroup[]> => {
  if (!q) return [];
  const response = await api.get('/user-groups/search', { params: { q } });
  return response.data;
};

export const fetchUserGroupById = async (id: string): Promise<UserGroup> => {
  const response = await api.get(`/user-groups/${id}`);
  return response.data;
};

export const fetchUsersGroupById = async (id: string): Promise<User[]> => {
  const response = await api.get(`/user-groups/users/${id}`);
  return response.data;
};

export const createUserGroup = async (data: UserGroupCreate): Promise<UserGroup> => {
  const response = await api.post('/user-groups', data);
  return response.data;
};

export const editUserGroup = async (id: string, data: UserGroupEdit): Promise<UserGroup> => {
  const response = await api.patch(`/user-groups/${id}`, data);
  return response.data;
};

export const deleteUserGroup = async (id: string) => {
  const response = await api.delete(`/user-groups/${id}`);
  return response.data;
};

export const removeUserFromGroup = async (id: string, data: { userId: string }): Promise<UserGroup> => {
  const response = await api.patch(`/user-groups/remove-user/${id}`, data);
  return response.data;
};

export const blockUserGroup = async (id: string) => {
  const response = await api.post(`/user-groups/${id}/block-group`);
  return response.data;
};

export const unblockUserGroup = async (id: string) => {
  const response = await api.post(`/user-groups/${id}/unblock-group`);
  return response.data;
};


export const addAllowedAuctionGroup = async (groupId: string, auctionGroupId: string) => {
  const response = await api.post(`/user-groups/${groupId}/add-auction-group`, { auctionGroupId });
  return response.data;
};

export const removeAllowedAuctionGroup = async (groupId: string, auctionGroupId: string) => {
  const response = await api.delete(`/user-groups/${groupId}/remove-auction-group`, {
    data: { auctionGroupId },
  });
  return response.data;
};


export const addAllowedAuction = async (groupId: string, auctionId: string) => {
  const response = await api.post(`/user-groups/${groupId}/add-auction`, { auctionId });
  return response.data;
};

export const removeAllowedAuction = async (groupId: string, auctionId: string) => {
  const response = await api.delete(`/user-groups/${groupId}/remove-auction`, {
    data: { auctionId },
  });
  return response.data;
};


export const addAllowedAccount = async (groupId: string, accountId: string) => {
  const response = await api.post(`/user-groups/${groupId}/add-account`, { accountId });
  return response.data;
};

export const removeAllowedAccount = async (groupId: string, accountId: string) => {
  const response = await api.delete(`/user-groups/${groupId}/remove-account`, {
    data: { accountId },
  });
  return response.data;
};




export const fetchAllAuctionGroups = async (): Promise<CatalogAuctionGroup[]> => {
  const response = await api.get('/auction-groups');
  return response.data;
};

export const fetchAuctionsByAuctionGroup = async (auctionGroupId: string): Promise<AuctionSummary[]> => {
  const response = await api.get(`/auctions/group/${auctionGroupId}`);
  return response.data;
};

export const fetchAuctionAccounts = async (auctionId: string): Promise<AccountSummary[]> => {
  const response = await api.get(`/auctions/${auctionId}`);
  return response.data?.auctionAuths ?? [];
};

export const fetchUsersByQuery = async (q: string): Promise<UserSummary[]> => {
  if (!q) return [];
  const response = await api.get('/users/search', { params: { query: q, limit: 10 } });
  return response.data?.data ?? [];
};


// --- Особисті дозволи окремого користувача ---

const PERSONAL_ACCESS_ROUTE: Record<AccessKind, { segment: string; field: string }> = {
  auctionGroup: { segment: 'auction-group', field: 'auctionGroupId' },
  auction: { segment: 'auction', field: 'auctionId' },
  account: { segment: 'account', field: 'accountId' },
};

export const fetchUserPersonalAccess = async (userId: string): Promise<PersonalAccess> => {
  const response = await api.get(`/users/${userId}/access`);
  return response.data;
};

export const setUserPersonalAccess = async (
  userId: string,
  kind: AccessKind,
  targetId: string,
  allow: boolean,
) => {
  const { segment, field } = PERSONAL_ACCESS_ROUTE[kind];
  const response = allow
    ? await api.post(`/users/${userId}/add-${segment}`, { [field]: targetId })
    : await api.delete(`/users/${userId}/remove-${segment}`, { data: { [field]: targetId } });
  return response.data;
};

// Заборона учаснику акаунта, наданого його групі (canGaManageAccounts).
export const setUserDeniedAccount = async (userId: string, accountId: string, deny: boolean) => {
  const response = deny
    ? await api.post(`/users/${userId}/deny-account`, { accountId })
    : await api.delete(`/users/${userId}/deny-account`, { data: { accountId } });
  return response.data;
};
