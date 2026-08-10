import { Parish } from "../institution/institution.interface";
import { IProviders } from "../provider/provider.interface";

export interface EventsBody {
    parishId: number;
    name: string;
    description: string;
    address: string;
    startDate: Date | string;
    startTime: string;
    endDate: Date | string;
    endTime: string;
    providersId: number[];
    cambio_proveedores?: boolean;
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
    startDate: Date;
    endDate: Date;
    deleted: boolean;
    createAt: Date;
    updateAt: Date;
    parish: Parish;
    providersEvents: IProviders[];
}
