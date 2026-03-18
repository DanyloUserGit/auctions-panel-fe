import { api } from "../../../shared/http"
import type { ICalculationForm } from "./types";

export const getBrands = async (db: string, table: string) => {
    return await api.get(`/calc/brands?db=${db}&table=${table}`);
}

export const getModels = async (db: string, table: string, marka: string) => {
    return await api.get(`/calc/models?db=${db}&table=${table}&marka=${marka}`);
}

export const getEstimate = async (db: string, form: ICalculationForm) => {
    return await api.get('/calc/estimate', {
        params: { ...form, db }
    });
}
