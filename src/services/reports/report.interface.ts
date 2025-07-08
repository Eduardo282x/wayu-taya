export interface BodyReport {
    from: Date;
    to: Date;
}

export interface ReportDonations {
    provider: string
    lotes: string[];
}

export interface IReports {
    donations: Donaciones[];
    productMostDonated: ProductsMostDonated[];
    productByStorage: ProductByStorage[];
    totalInventory: number;
    period: Periodo;
    providers: { provider: string, id: number }[];
    lotes: string[];
}

export interface ProductByStorage {
    storage: string;
    totalProducts: number;
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
