import { api } from '../../../shared/http';
import type { Auction, AuctionCreate, AuctionEdit } from './types';

export const fetchAuctions = async (groupId: string) => {
  if (!groupId) return [];
  const responce = await api.get(`/auctions/group/${groupId}`);
  return responce.data;
};

export const fetchAuctionsByQuery = async (q: string): Promise<Auction[]> => {
  if (!q) return [];
  const responce = await api.get(`/auctions/search`, {
    params: {
      query: q,
    },
  });
  return responce.data;
};
export const createAuction = async (data: AuctionCreate) => {
  const responce = await api.post('auctions', data);
  return responce.data;
};
export const editAuction = async (id: string, data: AuctionEdit) => {
  const responce = await api.patch(`auctions/${id}`, data);
  return responce.data;
};

export const deleteAuction = async (id: string) => {
  const responce = await api.delete(`auctions/${id}`);
  return responce.data;
};
export const fetchAuctionsByGroup = async (
  groupId: string,
): Promise<Auction[]> => {
  const responce = await api.get(`auctions/group/${groupId}`);
  return responce.data;
};

export const fetchAuctionsById = async (id: string): Promise<Auction> => {
  const responce = await api.get(`/auctions/${id}`);
  return responce.data;
};
