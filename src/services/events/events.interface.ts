import { IProviders } from "../provider/provider.interface";
import type { Location } from "../location.interface";

export interface EventsBody {
    location: Location;
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
    location: Location;
    startDate: Date;
    endDate: Date;
    deleted: boolean;
    createAt: Date;
    updateAt: Date;
    providersEvents: IProviders[];
}
