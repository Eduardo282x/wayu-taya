export interface StoreBody {
    name: string;
    address: string;
    capacity: number;
}

export interface GroupStore {
    allStores: IStore[];
    stores: IStore[];
}

export interface StoreContent {
    stores: IStore[]
}
export interface IStore {
    id: number;
    name: string;
    address: string;
    deleted?: boolean;
    amount?: number;
    capacity: number;
    usedCapacity?: number;
    availableCapacity?: number;
    capacityPercentage?: number;
}