import { api } from '../../../shared/http';

export type CarStatus = 'available' | 'reserved' | 'sold';

export interface Car {
  id: number;
  brandId: number;
  modelId: number;
  brand: string;
  model: string;
  year: number | null;
  mileage: number;
  engine: string;
  transmission: 'Automatic' | 'Mechanic' | string;
  price: number;
  chassis: string;
  photos: string[];
  imageUrl: string | null;
  status: CarStatus;
  location: string;
  owner: { id: string; name: string } | null;
  canEdit: boolean;
  canSell: boolean;
}

export interface CarsResponse {
  canAdd: boolean;
  cars: Car[];
}

export interface CarFilters {
  search?: string;
  status?: CarStatus | '';
  priceFrom?: number | '';
  priceTo?: number | '';
}

export interface CarPayload {
  // ID виграного авто, якщо його виставляють на продаж зі сторінки «Покупки».
  sourcePurchaseId?: number;
  brandId: number;
  modelId: number;
  year: number;
  price: number;
  mileage: number;
  engine: string;
  transmission: string;
  chassis: string;
  status: CarStatus;
  location: string;
  photos: string[];
}

export interface CatalogItem {
  id: number;
  name: string;
}

const cleanFilters = (filters: CarFilters) =>
  Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined));

export const fetchInStockCars = async (filters: CarFilters): Promise<CarsResponse> => {
  const { data } = await api.get<CarsResponse>('/in-stock', { params: cleanFilters(filters) });
  return data;
};

export const createInStockCar = async (carData: CarPayload): Promise<Car> => {
  const { data } = await api.post('/in-stock', carData);
  return data;
};

export const updateInStockCar = async ({ id, carData }: { id: number; carData: CarPayload }): Promise<Car> => {
  const { data } = await api.put(`/in-stock/${id}`, carData);
  return data;
};

export const sellInStockCar = async (id: number): Promise<Car> => {
  const { data } = await api.post(`/in-stock/${id}/sell`);
  return data;
};

export const fetchBrands = async (q: string): Promise<CatalogItem[]> => {
  const { data } = await api.get('/in-stock/brands', { params: { q } });
  return data;
};

export const fetchModels = async (brandId: number, q: string): Promise<CatalogItem[]> => {
  const { data } = await api.get(`/in-stock/brands/${brandId}/models`, { params: { q } });
  return data;
};

export const uploadCarPhotos = async (files: File[]): Promise<string[]> => {
  const form = new FormData();
  files.forEach((file) => form.append('files', file));
  const { data } = await api.post<{ urls: string[] }>('/in-stock/photos', form);
  return data.urls;
};
