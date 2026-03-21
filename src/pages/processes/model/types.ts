export interface CarStatuses {
  doneOplata: boolean;
  doneZez: boolean;
  doneTrsp: boolean;
  doneDauto: boolean;
  doneCmr: boolean;
  doneDocs: boolean;
  doneSale: boolean;
  hasZezEff: boolean;
  hasTrspEff: boolean;
  hasCmrEff: boolean;
  isRealizedStrict: boolean;
}

export interface Protocol {
  count: number;
  first_id: number | null;
}

export interface Car {
  id: number;
  zamovnyk: string;
  marka_model: string;
  numer_rej: string;
  numer_vin: string;
  google_link: string | null;
  documents: string | null;
  data_rej: string | null;
  data_faktury_zakup: string | null;
  data_oplaty: string | null;
  data_zezwolenia: string | null;
  data_zamowienia_transportu: string | null;
  transport: string | null;
  data_dostarczenia_auta: string | null;
  data_wysylki_cmr: string | null;
  data_dostarczenia_dokumentow: string | null;
  data_faktury_sprzedaz: string | null;
  techDocsUrls: string[];
  protocol: Protocol;
  statuses: CarStatuses;
}

export interface Stats {
  wait_pay: number;
  wait_perm: number;
  wait_trsp: number;
  wait_dauto: number;
  wait_cmr: number;
  wait_docs: number;
  realized: number;
  total: number;
}

export interface ClientInfo {
  name: string;
}

export interface ProcessesResponse {
  clientInfo: ClientInfo;
  stats: Stats;
  cars: Car[];
}
