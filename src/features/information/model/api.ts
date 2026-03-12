import { api } from '../../../shared/http';
import type { CreateTraining } from '../../trainings/model/types';
import type { Info } from './schemas';
import type { EditInfo } from './types';

export const fetchInfo = async () => {
  const responce = await api.get('/training/info');
  console.log(responce.data);
  return responce.data;
};
export const createInfo = async (data: CreateTraining): Promise<Info> => {
  const responce = await api.post('/training/info', data);
  console.log(responce.data);
  return responce.data;
};

export const editInfo = async (id: string, data: EditInfo): Promise<Info> => {
  const responce = await api.patch(`/training/info/${id}`, data);
  console.log(responce.data);
  return responce.data;
};

export const fetchInfoBySlug = async (slug: string): Promise<Info> => {
  const responce = await api.get(`/training/info/${slug}`);
  console.log(responce.data);
  return responce.data;
};
