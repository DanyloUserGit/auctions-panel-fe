import { api } from '../../../shared/http';
import type { Group, GroupCreate, GroupEdit } from './types';

export const fetchGroups = async (): Promise<Group[]> => {
  const responce = await api.get('/auction-groups');
  return responce.data;
};
export const fetchGroupByQuery = async (q: string): Promise<Group[]> => {
  const responce = await api.get(`/auction-groups/search`, {
    params: { q },
  });
  return responce.data;
};
export const fetchGroupByid = async (id: string): Promise<Group[]> => {
  if (!id) return [];
  const responce = await api.get(`/auction-groups/${id}`);
  console.log(responce.data)
  return responce.data;
};
export const createGroup = async (newGroup: GroupCreate) => {
  const responce = await api.post('/auction-groups', newGroup);
  return responce.data;
};
export const editGroup = async ({
  id,
  group,
}: {
  id: string;
  group: GroupEdit;
}) => {
  const responce = await api.patch(`/auction-groups/${id}`, group);
  return responce.data;
};

export const deleteGroup = async (groupId: string) => {
  const data = await api.delete(`/auction-groups/${groupId}`);
  return data;
};
export const blockGroup = async (groupId: string) => {
  const data = await api.post(`/auction-groups/${groupId}/block-group`);
  return data;
}
export const unblockGroup = async (groupId: string) => {
  const data = await api.post(`/auction-groups/${groupId}/unblock-group`);
  return data;
}