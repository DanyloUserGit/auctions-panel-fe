import { api } from '../../../shared/http';
import type { CreateTraining, EditTraining } from './types';

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

export const updateTraining = async (id: string, data: EditTraining) => {
  const responce = await api.patch(`/training/materials/${id}`, data);
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

export const uploadTrainingImage = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/training/materials/${id}/image`, formData);
  return response.data;
};
