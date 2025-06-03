export interface EventsBody {
    parishId: number;
    name: string;
    description: string;
    address: string;
    date: Date;
    providersId: number[];
    cambio_proveedores: boolean;
}

export interface GroupEvents {
    allEvents: IEvents[];
    events: IEvents[]
}

export interface IEvents {
    id: number;
    name: string;
    description: string;
    address: string;
    parishId: number;
    date: Date;
    deleted: boolean;
    createAt: Date;
    updateAt: Date;
    parish: Parish;
    providersEvents: ProvidersEvent[];
}

export interface Parish {
    id: number;
    name: string;
    townId: number;
}

export interface ProvidersEvent {
    id: number;
    name: string;
    rif: string;
    address: string;
    country: string;
    email: string;
    deleted: boolean;
}
