import { api } from '../../../shared/http';
import type {
  CustomsTableId,
  ICalculationForm,
  ICalculationResult,
  IRozmitnenniaEstimateRequest,
  ISoldMeta,
  ISoldRow,
  ITableMeta,
  ITableRow,
} from './types';

// NOTE:
// These methods mirror the logic from rozrahunok(1).tpl.
// They assume the controller exposes matching routes under /calc/*.

export const getBrands = async (db: string, table: CustomsTableId | string) => {
  return await api.get<string[]>('/calc/brands', {
    params: { db, table },
  });
};

export const getModels = async (
  db: string,
  table: CustomsTableId | string,
  marka: string,
) => {
  return await api.get<string[]>('/calc/models', {
    params: { db, table, marka },
  });
};

export const getEstimate = async (db: string, form: ICalculationForm) => {
  return await api.get('/calc/estimate', {
    params: { ...form, db },
  });
};

export const getRozrahunokBrands = async (
  db: string,
  table: CustomsTableId,
) => {
  return await api.get<{ items: string[] }>('/calc/marka', {
    params: { db, table },
  });
};

export const getRozrahunokModels = async (
  db: string,
  table: CustomsTableId,
  marka: string,
) => {
  return await api.get<{ items: string[] }>('/calc/model', {
    params: { db, table, marka },
  });
};

export const getRozrahunokTypes = async (
  db: string,
  table: CustomsTableId,
  marka: string,
  model: string,
) => {
  return await api.get<{ items: string[] }>('/calc/typ', {
    params: { db, table, marka, model },
  });
};

export const getRozrahunokYears = async (
  db: string,
  table: CustomsTableId,
  marka: string,
  model: string,
  typ: string,
) => {
  return await api.get<{ items: string[] }>('/calc/years', {
    params: { db, table, marka, model, typ },
  });
};

export const getRozrahunokPrice = async (
  db: string,
  table: CustomsTableId,
  marka: string,
  model: string,
  typ: string,
  year: string,
) => {
  return await api.get<{ found: boolean; price?: number | string | null }>(
    '/calc/price',
    {
      params: { db, table, marka, model, typ, year },
    },
  );
};

export const getRozrahunokEstimate = async (
  db: string,
  payload: IRozmitnenniaEstimateRequest,
) => {
  return await api.get<ICalculationResult>('/calc/rozrahunok-estimate', {
    params: { db, ...payload },
  });
};

export const getTableMeta = async (db: string, table: CustomsTableId) => {
  return await api.get<ITableMeta>('/calc/table-meta', {
    params: { db, table },
  });
};

export const getTableRows = async (
  db: string,
  table: CustomsTableId,
  qmarka = '',
  qmodel = '',
  qtyp = '',
) => {
  return await api.get<{ rows: ITableRow[] }>('/calc/table-rows', {
    params: { db, table, qmarka, qmodel, qtyp },
  });
};

export const getSoldMeta = async (db: string, year = '') => {
  return await api.get<ISoldMeta>('/calc/sold-meta', {
    params: { db, year },
  });
};

export const getSoldRows = async (
  db: string,
  params: {
    q?: string;
    year?: string;
    months?: string;
    sort?: string;
    dir?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  },
) => {
  return await api.get<{ rows: ISoldRow[] }>('/calc/sold-rows', {
    params: { db, ...params },
  });
};
