import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createGroup,
  deleteGroup,
  editGroup,
  fetchGroupByid,
  fetchGroupByQuery,
  fetchGroups,
} from './api-groups';
import type { GroupCreate, GroupEdit } from './types';
import { authKeys } from '../../auth/model/useAuth';
export const groupsKeys = {
  key: ['groups'] as const,
  detail: (id: string) => [...groupsKeys.key, id] as const,
};

export function useGroups(groupId?: string) {
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: groupsKeys.key,
    queryFn: fetchGroups,
    staleTime: 5 * 60 * 1000,
  });
  const groupDetailQuery = useQuery({
    queryKey: groupsKeys.detail(groupId || ''),
    queryFn: () => fetchGroupByid(groupId || ''),
    staleTime: 5 * 60 * 1000,
  });

  const GroupCreation = useMutation({
    mutationFn: (newGroup: GroupCreate) => {
      console.log(newGroup);
      return createGroup(newGroup);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.key });
      queryClient.invalidateQueries({ queryKey: authKeys.users });
    },
  });

  const EditGroupMutation = useMutation({
    mutationFn: ({ id, group }: { id: string; group: GroupEdit }) =>
      editGroup({ id, group }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.key });
      queryClient.invalidateQueries({ queryKey: ['auctions', variables.id] });
      queryClient.invalidateQueries({ queryKey: authKeys.users });

      if (variables.group.groupAdminId) {
        queryClient.invalidateQueries({
          queryKey: authKeys.controlCard(variables.group.groupAdminId),
        });
      }
    },
  });
  const DeleteGroupMutation = useMutation({
    mutationFn: (id: string) => deleteGroup(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: groupsKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: groupsKeys.key });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    items: data,
    isLoading,
    isError,
    error: error ?? null,
    groupDetail: groupDetailQuery.data,
    isLoadingDetail: groupDetailQuery.isLoading,
    GroupCreation,
    EditGroupMutation,
    DeleteGroupMutation,
  };
}
export function useGroupByQuery(searchTerm: string = '') {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [...groupsKeys.key, { search: searchTerm }],
    queryFn: () => fetchGroupByQuery(searchTerm),
    staleTime: 5 * 60 * 1000,
    enabled: searchTerm.length >= 2 || searchTerm.length === 0,
  });

  return { data, isLoading, isError, error };
}
