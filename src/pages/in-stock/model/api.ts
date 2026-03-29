import { api } from "../../../shared/http";

export type CarStatus = 'available' | 'reserved' | 'sold';

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  engine: string;
  transmission: 'Automatic' | 'Mechanic' | string;
  price: number;
  chassis: string;
  imageUrl: string;
  status: CarStatus;
  location: string;
}
const CLIENT_DB_HEADER = {
  headers: {
    'x-db-name': 'caddylc2_caddycombca',
  },
};

export const fetchInStockCars = async (): Promise<Car[]> => {
  const { data } = await api.get<Car[]>('/in-stock', { ...CLIENT_DB_HEADER });
  return data;
};

export const createInStockCar = async (carData: Partial<Car>): Promise<any> => {
  const { data } = await api.post('/in-stock', carData, { ...CLIENT_DB_HEADER });
  return data;
};

export const updateInStockCar = async ({ id, carData }: { id: number; carData: Partial<Car> }): Promise<any> => {
  const { data } = await api.put(`/in-stock/${id}`, carData, { ...CLIENT_DB_HEADER });
  return data;
};