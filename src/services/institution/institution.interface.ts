import { PaginationQuery } from "../base.interface";
import type { Location } from "../location.interface";

export interface InstitutionContent {
    institutions: IInstitution[];
}

export interface PaginatedInstitutionsContent {
    institutions: IInstitution[];
    page: number;
    size: number;
    total: number;
    totalPages: number;
}

export type InstitutionsQueryParams = PaginationQuery;

export interface IInstitution {
    id: number;
    name: string;
    rif: string;
    address: string;
    phone: string;
    responsible: string;
    country: string;
    email: string;
    type: string;
    location: Location;
    deleted: boolean;
}

export interface InstitutionsBody {
    name: string;
    rif: string;
    address: string;
    responsible: string;
    phone: string;
    country: string;
    email: string;
    type: string;
    location: Location;
}