import { PaginationQuery } from "../base.interface";

export interface ProvidersContent {
    providers: IProviders[];
}

export interface PaginatedProvidersContent {
    providers: IProviders[];
    page: number;
    size: number;
    total: number;
    totalPages: number;
}

export type ProvidersQueryParams = PaginationQuery;

export interface IProviders {
    id: number;
    name: string;
    rif: string;
    address: string;
    country: string;
    email: string;
    deleted: boolean;
}


export interface ProviderBody {
    name: string;
    rif: string;
    address: string;
    country: string;
    email: string;
    responsible: string;
    phone: string;
}
