import { api } from '../../../shared/http';

export const addAuctionToGroup = async (
  groupId: string,
  data: { auctionId: string },
) => {
  if (!groupId) return;
  const response = await api.post(
    `/auction-groups/${groupId}/add-auction`,
    data,
  );
  return response.data;
};

export const removeAuctionFromGroup = async (
  groupId: string,
  data: { auctionId: string },
) => {
  if (!groupId) return;
  const response = await api.delete(`/auction-groups/${groupId}/remove-user`, {
    data,
  });
  return response.data;
};
export const grantAccountAccess = async (groupId: string, userId: string) => {
  if (!groupId) return;
  const response = await api.post(
    `/auction-groups/${groupId}/grant-account-access`,
    { userId: userId },
  );
  return response.data;
};

export const revokeAccountAccess = async (groupId: string, userId: string) => {
  if (!groupId || !userId) return;
  const response = await api.delete(
    `/auction-groups/${groupId}/revoke-account-access/${userId}`,
  );
  return response.data;
};
