import { api } from '../../../shared/http';
import type { GlobalSettingsDTO } from './types';

export const fetchGlobalSettings = async () => {
  const responce = await api.get('/global-settings');
  return responce.data;
};
export const updateGlobalSettings = async (data: GlobalSettingsDTO) => {
  const responce = await api.patch('/global-settings', data);
  return responce.data;
};
