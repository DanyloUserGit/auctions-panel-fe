import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { authKeys } from '../../auth/model/useAuth';
import {
  fetchGroups,
  fetchGroupByid,
  fetchGroupByQuery,
  createGroup,
  editGroup,
  deleteGroup,
  blockGroup,
  unblockGroup,
} from './api-groups';
import type { GroupCreate, GroupEdit } from './types';

export const groupsKeys = {
  all: ['groups'] as const,
  lists: () => [...groupsKeys.all, 'list'] as const,
  list: (searchTerm: string) =>
    [...groupsKeys.lists(), { searchTerm }] as const,
  details: () => [...groupsKeys.all, 'detail'] as const,
  detail: (id: string) => [...groupsKeys.details(), id] as const,
};
export function useGroups() {
  return useQuery({
    queryKey: groupsKeys.lists(),
    queryFn: fetchGroups,
    staleTime: 5 * 60 * 1000,
  });
}

// Отримання детальної інформації про одну групу
export function useGroupById(groupId?: string) {
  return useQuery({
    queryKey: groupsKeys.detail(groupId || ''),
    queryFn: () => fetchGroupByid(groupId || ''),
    enabled: !!groupId,
    staleTime: 5 * 60 * 1000,
  });
}

// Пошук груп
export function useGroupByQuery(searchTerm: string = '') {
  return useQuery({
    queryKey: groupsKeys.list(searchTerm),
    queryFn: () => fetchGroupByQuery(searchTerm),
    staleTime: 5 * 60 * 1000,
    enabled: searchTerm.length >= 2 || searchTerm.length === 0,
  });
}

// Створення групи
export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newGroup: GroupCreate) => createGroup(newGroup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      queryClient.invalidateQueries({ queryKey: authKeys.users });
    },
  });
}

// Редагування групи
export function useEditGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, group }: { id: string; group: GroupEdit }) =>
      editGroup({ id, group }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['auctions', variables.id] });
      queryClient.invalidateQueries({ queryKey: authKeys.users });

      if (variables.group.Admin) {
        queryClient.invalidateQueries({
          queryKey: authKeys.controlCard(variables.group.Admin),
        });
      }
    },
  });
}

// Видалення групи
export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGroup(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: groupsKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
export function useBlockGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => blockGroup(groupId),
    onSuccess: (_, groupId) => {
      // Оновлюємо список усіх груп
      queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      // Оновлюємо конкретну групу (деталі), якщо вона відкрита
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
      // Оновлюємо користувачів, бо статус групи може впливати на їх доступ
      queryClient.invalidateQueries({ queryKey: authKeys.users });
    },
  });
}

// Хук для розблокування групи
export function useUnblockGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => unblockGroup(groupId),
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      queryClient.invalidateQueries({ queryKey: groupsKeys.detail(groupId) });
      queryClient.invalidateQueries({ queryKey: authKeys.users });
    },
  });
}