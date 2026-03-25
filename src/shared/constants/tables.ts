import type { CustomsTableId, ICalculationForm, IRozmitnenniaForm, ISimpleCalcForm } from "../../pages/calculation/model/types";

export const DB_NAME = 'table_extourcars1';
export const TABLES: CustomsTableId[] = ['27031', '27032', '27033'];

export const TABLE_LABELS: Record<CustomsTableId, string> = {
    '27031': 'Європа',
    '27032': 'Не ЄС',
    '27033': 'Електро',
};

export const SIMPLE_STORAGE_KEY = 'calculation_page_simple_calc';

export const defaultRozForm: IRozmitnenniaForm = {
    table: '',
    marka: '',
    model: '',
    typ: '',
    year: '',
    param: '',
    delivery: '',
    fx: '1.17',
};

export const defaultFullCalcForm: ICalculationForm = {
    table: '27031',
    marka: '',
    model: '',
    typ: '',
    year: '',
    auctionPrice: 5000,
    engineVolume: 2000,
    fuelType: 'petrol',
    road: 0,
    cert: 70,
    border: 50,
    towing: 200,
};

export const defaultSimpleForm: ISimpleCalcForm = {
    carYear: '',
    carBrand: '',
    carModel: '',
    carLink: '',
    stavka: 0,
    aukcion: 0,
    dostavka: 0,
    dodatkovi: 0,
    nashi: 0,
    kurs: 0,
    rozmitn: 0,
    doroga: 0,
    sertif: 0,
    kordon: 0,
    laveta: 0,
};
