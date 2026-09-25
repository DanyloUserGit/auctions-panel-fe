
import { api } from "../../../shared/http";

export interface CarMarketRow {
  id: number;
  auction_type: number;
  price: number;
  mileage: number;
  countdown_ts: number;
  first_on_road_ts: number;
  brand_name: string;
  model_name: string;
  eng_capacity: string;
  transmission: string;
  characteristics: string;
  report: string | null;
  photos: string | null;
  chassis: string;
  eng_power_hp: number;
  eng_power_kw: number;
  country_id: number;
}

export interface AnalyticsResponse {
  targetCar: {
    chassis: string;
    price: number;
    mileage: number;
    brand_name: string;
    model_name: string;
  };
  vinSales: CarMarketRow[];
  pricesList: CarMarketRow[];
}

export const fetchAnalyticsByVin = async (vin: string): Promise<AnalyticsResponse> => {
  if (!vin) throw new Error('VIN-код є обов’язковим');

  const response = await api.get<AnalyticsResponse>(`/analytics/search/${encodeURIComponent(vin)}`);

  return response.data;
};
