import { api } from '../../../shared/http';
import type { Account, AccountCreate, AccountUpdate } from './types';

export const fetchAcountsByAuction = async (id: string) => {
  const responce = await api.get(`/auction-auth/${id}`);
  return responce.data;
};
export const createAcount = async (data: AccountCreate) => {
  const responce = await api.post(`/auction-auth`, data);
  return responce.data;
};
export const updateAcount = async (id: string, data: AccountUpdate) => {
  const responce = await api.patch(`/auction-auth/${id}`, data);
  return responce.data;
};
export const deleteAcount = async (id: string) => {
  const responce = await api.delete(`/auction-auth/${id}`);
  return responce.data;
};
export const addToFavourite = async (accountId: string) => {
  const responce = await api.post(`/auction-auth/select-account`, {
    accountId,
  });
  return responce.data;
};
export const GetFavourite = async (): Promise<Account[]> => {
  const responce = await api.get(`/auction-auth/selected`);
  return responce.data;
};
export const RemoveFromFavourite = async (accountId: string) => {
  const responce = await api.delete(
    `/auction-auth/remove-account/${accountId}`,
  );
  return responce.data;
};
