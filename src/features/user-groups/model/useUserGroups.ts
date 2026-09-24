import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addAllowedAccount,
  addAllowedAuction,
  addAllowedAuctionGroup,
  blockUserGroup,
  createUserGroup,
  deleteUserGroup,
  editUserGroup,
  fetchAllAuctionGroups,
  fetchAuctionAccounts,
  fetchAuctionsByAuctionGroup,
  fetchUserGroupById,
  fetchUserGroups,
  fetchUserGroupsByQuery,
  fetchUsersByQuery,
  fetchUserPersonalAccess,
  fetchUsersGroupById,
  removeAllowedAccount,
  removeAllowedAuction,
  removeAllowedAuctionGroup,
  removeUserFromGroup,
  setUserDeniedAccount,
  setUserPersonalAccess,
  unblockUserGroup,
} from './api';
import type { AccessKind, UserGroupCreate, UserGroupEdit } from './types';

export const userGroupsKeys = {
  all: ['user-groups'] as const,
  search: (q: string) => [...userGroupsKeys.all, 'search', q] as const,
  detail: (id: string) => [...userGroupsKeys.all, 'detail', id] as const,
  detailUsers: (id: string) => [...userGroupsKeys.all, 'detailUsers', id] as const,
};

export function useUserGroupsData() {
  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: userGroupsKeys.all,
    queryFn: fetchUserGroups,
    staleTime: 60 * 1000,
  });

  return { items: data, isLoading, isError, error: error ?? null };
}

export function useUserGroupsSearch(q: string) {
  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: userGroupsKeys.search(q),
    queryFn: () => fetchUserGroupsByQuery(q),
    enabled: !!q,
  });

  return { items: data, isLoading, isError, error: error ?? null };
}

export function useUserGroup(id?: string) {
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: userGroupsKeys.detail(id || ''),
    queryFn: () => fetchUserGroupById(id!),
    enabled: !!id,
    staleTime: 0,
  });

  return { group: data, isLoading, isFetching, isError, error: error ?? null };
}

export function useUsersGroup(id?: string) {
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: userGroupsKeys.detailUsers(id || ''),
    queryFn: () => fetchUsersGroupById(id!),
    enabled: !!id,
    staleTime: 0,
  });

  return { users: data, isLoading, isFetching, isError, error: error ?? null };
}

function useInvalidateGroup(groupId?: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: userGroupsKeys.all });
    if (groupId) queryClient.invalidateQueries({ queryKey: userGroupsKeys.detail(groupId) });
  };
}

export function useCreateUserGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserGroupCreate) => createUserGroup(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userGroupsKeys.all }),
  });
}

export function useEditUserGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserGroupEdit }) => editUserGroup(id, data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: userGroupsKeys.all });
      queryClient.invalidateQueries({ queryKey: userGroupsKeys.detail(variables.id) });
    },
  });
}

export function useDeleteUserGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUserGroup(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userGroupsKeys.all }),
  });
}

export function useRemoveUserFromGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { userId: string } }) => removeUserFromGroup(id, data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: userGroupsKeys.all });
      queryClient.invalidateQueries({ queryKey: userGroupsKeys.detail(variables.id) });
    },
  });
}

export function useToggleUserGroupActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      !isActive ? unblockUserGroup(id) : blockUserGroup(id),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: userGroupsKeys.all });
      queryClient.invalidateQueries({ queryKey: userGroupsKeys.detail(variables.id) });
    },
  });
}


export function useToggleAllowedAuctionGroup(groupId: string) {
  const invalidate = useInvalidateGroup(groupId);
  return useMutation({
    mutationFn: ({ auctionGroupId, allow }: { auctionGroupId: string; allow: boolean }) =>
      allow
        ? addAllowedAuctionGroup(groupId, auctionGroupId)
        : removeAllowedAuctionGroup(groupId, auctionGroupId),
    onSuccess: invalidate,
  });
}


export function useToggleAllowedAuction(groupId: string) {
  const invalidate = useInvalidateGroup(groupId);
  return useMutation({
    mutationFn: ({ auctionId, allow }: { auctionId: string; allow: boolean }) =>
      allow ? addAllowedAuction(groupId, auctionId) : removeAllowedAuction(groupId, auctionId),
    onSuccess: invalidate,
  });
}


export function useToggleAllowedAccount(groupId: string) {
  const invalidate = useInvalidateGroup(groupId);
  return useMutation({
    mutationFn: ({ accountId, allow }: { accountId: string; allow: boolean }) =>
      allow ? addAllowedAccount(groupId, accountId) : removeAllowedAccount(groupId, accountId),
    onSuccess: invalidate,
  });
}


export function useAllAuctionGroups() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['auction-groups', 'all'],
    queryFn: fetchAllAuctionGroups,
    staleTime: 5 * 60 * 1000,
  });
  return { auctionGroups: data, isLoading };
}

export function useAuctionsByAuctionGroup(auctionGroupId?: string) {
  const { data = [], isLoading } = useQuery({
    queryKey: ['auctions', 'by-auction-group', auctionGroupId],
    queryFn: () => fetchAuctionsByAuctionGroup(auctionGroupId!),
    enabled: !!auctionGroupId,
    staleTime: 60 * 1000,
  });
  return { auctions: data, isLoading };
}

export function useAuctionAccounts(auctionId?: string) {
  const { data = [], isLoading } = useQuery({
    queryKey: ['auctions', 'accounts', auctionId],
    queryFn: () => fetchAuctionAccounts(auctionId!),
    enabled: !!auctionId,
    staleTime: 60 * 1000,
  });
  return { accounts: data, isLoading };
}

export function useUsersSearch(q: string) {
  const { data = [], isLoading } = useQuery({
    queryKey: ['users', 'search', q],
    queryFn: () => fetchUsersByQuery(q),
    enabled: q.length > 1,
  });
  return { users: data, isLoading };
}

export const personalAccessKey = (userId: string) => ['users', 'personal-access', userId] as const;

export function useUserPersonalAccess(userId?: string) {
  const { data, isLoading } = useQuery({
    queryKey: personalAccessKey(userId || ''),
    queryFn: () => fetchUserPersonalAccess(userId!),
    enabled: !!userId,
    staleTime: 0,
  });
  return { grants: data, isLoading };
}

export function useTogglePersonalAccess(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ kind, id, allow }: { kind: AccessKind; id: string; allow: boolean }) =>
      setUserPersonalAccess(userId, kind, id, allow),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: personalAccessKey(userId) }),
  });
}

export function useToggleDeniedAccount(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ accountId, deny }: { accountId: string; deny: boolean }) =>
      setUserDeniedAccount(userId, accountId, deny),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: personalAccessKey(userId) }),
  });
}
