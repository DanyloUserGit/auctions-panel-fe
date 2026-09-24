import { api } from '../../../shared/http';
import type { Group, GroupCreate, GroupEdit } from './types';

export const fetchGroups = async (): Promise<Group[]> => {
  const response = await api.get('/auction-groups');
  return response.data;
};

export const fetchGroupByQuery = async (q: string): Promise<Group[]> => {
  const response = await api.get('/auction-groups/search', {
    params: { q },
  });
  return response.data;
};

export const fetchGroupById = async (id: string): Promise<Group> => {
  const response = await api.get(`/auction-groups/${id}`);
  return response.data;
};

export const createGroup = async (newGroup: GroupCreate): Promise<Group> => {
  const response = await api.post('/auction-groups', newGroup);
  return response.data;
};

export const editGroup = async ({
  id,
  group,
}: {
  id: string;
  group: GroupEdit;
}): Promise<Group> => {
  const response = await api.patch(`/auction-groups/${id}`, group);
  return response.data;
};

export const deleteGroup = async (groupId: string) => {
  const response = await api.delete(`/auction-groups/${groupId}`);
  return response.data;
};

export const addAuctionToGroup = async (groupId: string, auctionId: string) => {
  const response = await api.post(`/auction-groups/${groupId}/add-auction`, {
    auctionId,
  });
  return response.data;
};

export const removeAuctionFromGroup = async (
  groupId: string,
  auctionId: string,
) => {
  const response = await api.delete(
    `/auction-groups/${groupId}/remove-auction`,
    { data: { auctionId } },
  );
  return response.data;
};
