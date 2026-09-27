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

/**
 * Ubicacion geografica tal y como la espera la API.
 *
 * Sustituye a la antigua FK `parishId`: el backend ya no expone `/parroquias`
 * ni `/state`, asi que la jerarquia viaja como texto y el catalogo de
 * referencia se queda en el frontend (`dialog-location/location.data.ts`).
 * Los tres niveles son obligatorios, porque hay nombres de parroquia repetidos
 * entre municipios distintos.
 *
 * Cuando `people` y `events` migren al mismo contrato, este tipo debe subir a
 * un modulo compartido: el backend tiene un unico `LocationDTO` para los tres.
 */
export interface Location {
    state: string;
    town: string;
    parish: string;
}

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

/**
 * Sigue viva solo porque `events.interface.ts` y `people.interface.ts` todavia
 * la importan. Se va cuando esas dos se migren a `Location`.
 */
export interface Parish {
    id: number;
    name: string;
    townId: number;
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