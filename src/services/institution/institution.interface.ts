import { PaginationQuery } from "../base.interface";

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
    country: string;
    email: string;
    type: string;
    parish: ParishRef;
    parishId: number;
    deleted: boolean;
}

export interface Parish {
    id: number;
    name: string;
    townId: number;
}

export interface ParishRef {
    name: string;
}

export interface ParishContent {
    parishes: IParish[]
}

export interface IParish {
    id:     number;
    name:   string;
    townId: number;
    town:   Town;
}

export interface Town {
    id:     number;
    name:   string;
    cityId: number;
    city:   City;
}

export interface City {
    id:      number;
    name:    string;
    stateId: number;
    state:   State;
}

export interface State {
    id:   number;
    name: string;
}





export interface InstitutionsBody {
    name: string;
    rif: string;
    address: string;
    country: string;
    email: string;
    type: string;
    parishId: number;
}