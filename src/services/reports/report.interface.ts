import { LotesContent } from "../donations/donations.interface";

export interface BodyReport {
    from: Date;
    to: Date;
}

export interface ReportDonations {
    provider: string
    lotes: string[];
}

/**
 * Filtros de exportacion (correccion 41 del backend). Todos opcionales: sin
 * ellos el reporte sigue exportando todo, como antes.
 */
export interface ReportFilters {
    from?: Date | string;
    to?: Date | string;
    providerId?: number;
    lote?: string;
    storeId?: number;
}

export interface IReports {
    donations: Donaciones[];
    productMostDonated: ProductsMostDonated[];
    productByStorage: ProductByStorage[];
    totalInventory: number;
    period: Periodo;
    providers: { provider: string, id: number }[];
    lotes: LotesContent;
}

export interface ProductByStorage {
    storage: string;
    totalProducts: number;
    capacity: number;
    usedCapacity: number;
    availableCapacity: number;
    capacityPercentage: number;
}

export interface GraphicStorage {
    name: string;
    value: number;
    fill: string;
}

export interface Donaciones {
    id: number;
    date: Date;
    details: Detail[];
}

export interface Detail {
    product: string;
    quantity: number;
}

export interface Periodo {
    desde: string;
    hasta: string;
}

export interface ProductsMostDonated {
    product: string;
    amount: number;
    percentage: number;
}
