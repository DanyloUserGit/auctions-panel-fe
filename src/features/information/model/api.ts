import { api } from '../../../shared/http';
import type { CreateTraining } from '../../trainings/model/types';
import type { Info } from './schemas';

export const fetchInfo = async (): Promise<Info[]> => {
  const responce = await api.get('/training/info');
  console.log(responce.data);
  return responce.data;
};
export const createInfo = async (data: CreateTraining): Promise<Info> => {
  console.log(data);
  const responce = await api.post('/training/info', data);
  return responce.data;
};

export const fetchInfoBySlug = async (slug: string): Promise<Info> => {
  const responce = await api.get('/training/info', {
    params: {
      q: slug,
    },
  });
  return responce.data;
};
