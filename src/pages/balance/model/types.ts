export interface BalanceRecord {
  id: number;
  vin: string;
  model: string;
  date: string;
  notes: string;
  isPlus: boolean;
  effectUsd: number;
  effectEur: number;
  effectPln: number;
  effectUah: number;
  balanceUsd: number;
  balanceEur: number;
  balancePln: number;
  balanceUah: number;
}

export interface ClientBalance {
  clientName: string;
  totalUsd: number;
  totalEur: number;
  totalPln: number;
  totalUah: number;
  records: BalanceRecord[];
}

export interface Transaction {
  id: number;
  date: string;
  diy: string;
  car: string;
  vin: string;
  marka: string;
  suma: number;
  effect: number;
  isPlus: boolean;
}

export interface GroupedTransaction {
  id: string;
  date: string;
  title: string;
  car: string;
  vin: string;
  sumEffect: number;
  balance: number;
  items: Transaction[];
}