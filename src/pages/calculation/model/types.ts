export interface ICalculationForm {
    table: string;
    marka: string;
    model: string;
    year: string;
    auctionPrice: number;
    engineVolume: number; 
    fuelType: 'petrol' | 'diesel'; 
    road: number;
    cert: number;
    border: number;
    towing: number;
}

export interface ICalculationResult {
    basePriceFromDb: number;
    details: {
        importDuty: number;
        excise: number;
        vat: number;
        totalCustoms: number;
    };
    serviceFee: number;
    totalInUkraine: number;
}