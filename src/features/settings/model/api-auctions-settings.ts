import { api } from '../../../shared/http';

export const fetchForbiddenPaths = async (auctionId: string) => {
  if (!auctionId) return;
  const response = await api.get(`auctions/${auctionId}/forbidden-paths`);
  return response.data;
};

export const fetchForbiddenSelectors = async (auctionId: string) => {
  if (!auctionId) return;
  const response = await api.get(`auctions/${auctionId}/forbidden-selectors`);
  return response.data;
};

export const fetchAllowedPaths = async (auctionId: string) => {
  if (!auctionId) return;
  const response = await api.get(`auctions/${auctionId}/allowed-paths`);
  return response.data;
};
export const addAuctionUser = async (id: string, data: { userId: string }) => {
  const response = await api.post(`auctions/${id}/add-user`, data);
  console.log(response.data);
  return response.data;
};

export const addAuctionSelector = async (
  id: string,
  data: { selector: string },
) => {
  const response = await api.post(`auctions/${id}/selector`, data);
  return response.data;
};

export const addAuctionAllowedPath = async (
  id: string,
  data: { path: string },
) => {
  console.log(data);
  const response = await api.post(`auctions/${id}/allowed`, data);
  return response.data;
};

export const addAuctionForbiddenPath = async (
  id: string,
  data: { path: string },
) => {
  const response = await api.post(`auctions/${id}/forbidden`, data);
  return response.data;
};
export const removeAllowedPath = async (id: string) => {
  const response = await api.delete(`auctions/remove-allowed-path/${id}`);
  return response.data;
};

export const removeForbiddenPath = async (id: string) => {
  const response = await api.delete(`auctions/remove-forbidden-path/${id}`);
  return response.data;
};

export const removeForbiddenSelector = async (id: string) => {
  if (!id) return;

  console.log(id);
  const response = await api.delete(`auctions/remove-forbidden-selector/${id}`);
  console.log(response.data);
  return response.data;
};

export const removeAuctionUser = async (
  id: string,
  data: { userId: string },
) => {
  if (!id || !data.userId) return;
  const response = await api.delete(`auctions/${id}/remove-user`, { data });
  console.log(response.data);
  return response.data;
};
