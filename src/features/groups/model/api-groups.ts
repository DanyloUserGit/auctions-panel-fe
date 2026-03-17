import { api } from '../../../shared/http';
import type { Group, GroupCreate, GroupEdit } from './types';

export const fetchGroups = async () => {
  const responce = await api.get('/auction-groups');
  console.log(responce.data)
  return responce.data;
};
export const fetchGroupByQuery = async (q: string): Promise<Group[]> => {
  const responce = await api.get(`/auction-groups/search`, {
    params: { q },
  });
  console.log(responce.data);
  return responce.data;
};
export const fetchGroupByid = async (id: string) => {
  if (!id) return {};
  const responce = await api.get(`/auction-groups/${id}`);
  return responce.data;
};
export const createGroup = async (newGroup: GroupCreate) => {
  const responce = await api.post('/auction-groups', newGroup);
  return responce.data;
};
export const editGroup = async ({ id, group, }: {
  id: string;
  group: GroupEdit;
}) => {
  console.log(group);
  const { data } = await api.patch(`/auction-groups/${id}`, {
    title: group.title,
    auctions: group.auctions,
    Admin: group.AdminId,
  });
  return data;
};

export const deleteGroup = async (groupId: string) => {
  const data = await api.delete(`/auction-groups/${groupId}`);
  return data;
};
