import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchGroupByid, fetchGroups } from '../http/api-groups';
export const groupsKeys = {
  key: ["groups"] as const,
  detail: (id: string) => [...groupsKeys.key, id] as const,
};


export function useGroups() {

  

  return {}
}