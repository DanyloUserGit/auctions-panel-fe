import { api } from '../../../shared/http';

export type OrderStatus =
  | 'new'
  | 'selection'
  | 'completed'
  | 'paused'
  | 'cancelled';

export interface OrderResponse {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  internal_id: string;
  brand_names: string;
  brand_ids_csv: string;
  model_names: string;
  fuel_names: string;
  gearbox_names: string;
  engine_cc: number | null;
  year_from_ts: number;
  year_to_ts: number;
  price_from: string;
  price_to: string;
  mileage_from: number;
  mileage_to: number;
  options_txt: string;
  extra_info: string;
  created_at: string; // ISO рядок дати
  updated_at: string; // ISO рядок дати
  engine_cc_from: number;
  engine_cc_to: number;
}

export type CreateOrderPayload = Omit<OrderResponse, 'id' | 'created_at'>;
export type UpdateOrderPayload = Partial<CreateOrderPayload>;

export const ordersApi = {
  getAll: async (search?: string): Promise<OrderResponse[]> => {
    const { data } = await api.get('/orders', {
      params: search ? { search } : {},
    });
    return data;
  },

  getById: async (id: number): Promise<OrderResponse> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  create: async (payload: CreateOrderPayload): Promise<OrderResponse> => {
    const { data } = await api.post('/orders', payload);
    return data;
  },

  update: async (
    id: number,
    payload: UpdateOrderPayload,
  ): Promise<OrderResponse> => {
    const { data } = await api.patch(`/orders/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};
