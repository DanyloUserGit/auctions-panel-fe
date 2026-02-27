import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createGroup, editGroup, fetchGroupByid, fetchGroups } from '../http/api-groups';
import type { GroupCreate, GroupEdit } from '../shemas/schemas';
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
      // Оновлюємо кеш, щоб список груп перевантажився автоматично
      queryClient.invalidateQueries({ queryKey: groupsKeys.key });
    },
  })

  const EditGroup = useMutation({
    // Тепер приймаємо об'єкт з id та data всередині mutate
    mutationFn: ({ id, data }: { id: string; data: GroupEdit }) => editGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsKeys.key });
    },
  });


  return { items: data, isLoading, isError, error: error ?? null, groupDetail: groupDetailQuery.data, isLoadingDetail: groupDetailQuery.isLoading, GroupCreation, EditGroup };
}