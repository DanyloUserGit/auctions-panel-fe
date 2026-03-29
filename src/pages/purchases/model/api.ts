import { api } from "../../../shared/http";


export interface Car {
    id: number;
    status: number; // 2: WON, 3: DISTRIBUTED, 4: REJECTED
    characteristics:string;
    auction_type:number;
    transmission:string;
    brand: string;
    model: string;
    price: number;
    max_bet: number;
    mileage: number;
    fuel: string;
    image: string;
    auction_name: string;
}

export interface Stats {
    total_count: number;
    distributed_count: number;
    total_amount: number;
}

export interface PurchasesResponse {
    cars: Car[];
    stats: Stats;
}

export interface UpdateStatusParams {
    carId: number;
    status: number;
    dbName: string;
}

export const purchasesApi = {
    // Отримання списку
    getPurchases: async (dbName: string): Promise<PurchasesResponse> => {
        const { data } = await api.get<PurchasesResponse>('/api/purchases', {
            params: { dbName },
        });
        return data;
    },

    // Оновлення статусу
    updateStatus: async ({ carId, status, dbName }: UpdateStatusParams): Promise<void> => {
        const { data } = await api.patch(`/api/purchases/${carId}/status`, {
            status,
            dbName,
        });
        return data;
    },
};