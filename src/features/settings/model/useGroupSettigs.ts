import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addAuctionToGroup,
  removeAuctionFromGroup,
  grantAccountAccess,
  revokeAccountAccess,
} from './api-groups-settings';
import { authKeys } from '../../auth/model/useAuth';
import { groupsKeys } from '../../groups/model/useGroups';

export const useAddAuctionToGroup = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { auctionId: string }) =>
      addAuctionToGroup(groupId, data),
    onSuccess: () => {
      // Оновлюємо конкретну групу та загальні списки
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupsKeys.all });
    },
  });
};

export const useRemoveAuctionFromGroup = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { auctionId: string }) =>
      removeAuctionFromGroup(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: groupsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupsKeys.all });
    },
  });
};

export const useGrantAccountAccess = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => grantAccountAccess(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
      // Якщо зміна прав впливає на користувачів або список акаунтів
      queryClient.invalidateQueries({ queryKey: authKeys.users });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useRevokeAccountAccess = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => revokeAccountAccess(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: authKeys.users });
    },
  });
};
