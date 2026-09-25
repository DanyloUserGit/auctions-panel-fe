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
}

export const purchasesApi = {
    getPurchases: async (): Promise<PurchasesResponse> => {
        const { data } = await api.get<PurchasesResponse>('/purchases');
        return data;
    },

    updateStatus: async ({ carId, status }: UpdateStatusParams): Promise<void> => {
        const { data } = await api.patch(`/purchases/${carId}/status`, { status });
        return data;
    },
};