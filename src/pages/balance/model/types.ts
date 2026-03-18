export interface BalanceRecord {
    id: number;
    vin: string;
    model: string;
    date: string;
    usd: number;
    eur: number;
    pln: number;
    uah: number;
    notes: string;
    isPlus: boolean;
}

export interface ClientBalance {
    clientName: string;
    totalUsd: number;
    totalEur: number;
    totalPln: number;
    totalUah: number;
    records: BalanceRecord[];
}