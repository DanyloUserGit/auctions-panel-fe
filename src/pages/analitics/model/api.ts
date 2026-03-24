import { api } from "../../../shared/http";
import type { CarAnalytics } from "./types";

const DB_NAME = 'caddylc2_caddycombca';

export const fetchCarAnalytics = async (carId: number): Promise<CarAnalytics> => {
    const response = await api.get(`/api/analytics/${carId}?dbName=${DB_NAME}`);

    return await response.data;
};