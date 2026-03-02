import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createGroup, deleteGroup, editGroup, fetchGroupByid, fetchGroupByQuery, fetchGroups } from './api-groups';
import type { GroupCreate, GroupEdit } from './types';
export const groupsKeys = {
  key: ["groups"] as const,
  detail: (id: string) => [...groupsKeys.key, id] as const,
};


export function useGroups(groupId?: string) {
  const queryClient = useQueryClient()

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

  })

  const GroupCreation = useMutation({
    mutationFn: (newGroup: GroupCreate) => createGroup(newGroup),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.key });
    },
  })




  const EditGroupMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: GroupEdit }) => editGroup(id, data),
    onSuccess: (_, variables) => {
      // 1. Оновлюємо список груп
      queryClient.invalidateQueries({ queryKey: groupsKeys.key });

      // 2. ВАЖЛИВО: Оновлюємо список аукціонів саме для цієї групи
      // Це змусить useAuctionsData(groupId) перечитати дані
      queryClient.invalidateQueries({ queryKey: ['auctions', variables.id] });
    },
  });

  const DeleteGroupMutation = useMutation({
    mutationFn: (id: string) => deleteGroup(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: groupsKeys.detail(deletedId) });
      // Оновлюємо список
      queryClient.invalidateQueries({ queryKey: groupsKeys.key });
    }
  })


  return { items: data, isLoading, isError, error: error ?? null, groupDetail: groupDetailQuery.data, isLoadingDetail: groupDetailQuery.isLoading, GroupCreation, EditGroupMutation, DeleteGroupMutation };
}
export function useGroupByQuery(searchTerm: string = "") {
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