import { api } from '../../../shared/http';
import type { CreateTraining } from './types';

export const fetchTraining = async (search: string) => {
  const responce = await api.get('/training/materials', {
    params: {
      search,
    },
  });
  return responce.data;
};
export const createTraining = async (data: CreateTraining) => {
  const responce = await api.post('/training/materials', data);
  return responce.data;
};
export const fetchTrainingById = async (id: string) => {
  const responce = await api.get(`/training/materials/${id}`);
  return responce.data;
};
export const publishMaterial = async (id: string, isPublished: boolean) => {
  const responce = await api.patch(`/training/materials/${id}/publish`, {
    isPublished,
  });
  return responce.data;
};
export const uploadTrainingImage = async ({ id }: { id: string }) => {
  const responce = await api.patch(`/training/materials/${id}/image`);
  return responce.data;
};
