import { api } from '../../../shared/http';
import type { CreateTraining } from './types';

export const fetchTraining = async () => {
  const responce = await api.get('/training/info');
  return responce.data;
};
export const createTraining = async (data: CreateTraining) => {
  console.log(data);
  const responce = await api.post('/training/info', data);
  return responce.data;
};

export const fetchTrainingBySlug = async (slug: string) => {
  const responce = await api.get('/training/info', {
    params: {
      q: slug,
    },
  });
  return responce.data;
};
export const fetchMaterials = async (search: string) => {
  const responce = await api.get('/training/materials', {
    params: {
      search,
    },
  });
  return responce.data;
};
export const createMaterials = async (data: CreateTraining) => {
  const responce = await api.post('/training/materials', data);
  return responce.data;
};
export const fetchMaterialsById = async (id: string) => {
  const responce = await api.get(`/training/materials/${id}`);
  return responce.data;
};
export const changeMaterialStatus = async ({
  id,
  isPublished,
}: {
  id: string;
  isPublished: boolean;
}) => {
  const responce = await api.patch(`/training/materials/${id}/publish`, {
    isPublished,
  });
  return responce.data;
};
export const uploadTrainingImage = async ({ id }: { id: string }) => {
  const responce = await api.patch(`/training/materials/${id}/image`);
  return responce.data;
};
