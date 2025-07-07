import { IMedicine } from "../medicine/medicine.interface";

export interface GroupInventory {
    allInventory: IInventory[];
    inventory: IInventory[];
}

export interface IInventory {
    id: number;
    medicine: IMedicine;
    totalStock: number;
    stores: Store[];
    datesMedicine: DatesMedicine[];
    lotes: ILotes[];
}

export interface ILotes {
    name: string;
    storeId: number;
    medicineId: number;
    expirationDate: Date;
    admissionDate: Date;
}
export interface IInventoryHistory {
    id: number;
    medicineId: number;
    storeId: number;
    type: string;
    amount: number;
    date: Date;
    donationId: number;
    observations: string;
    admissionDate: Date;
    expirationDate: Date;
    createAt: Date;
    updateAt: Date;
    medicine: IMedicine;
    store: Store;
    donation: Donation;
}

export interface Donation {
    id: number;
    institutionId: null;
    providerId: number;
    type: string;
    date: Date;
    lote: string;
    createAt: Date;
    updateAt: Date;
}
export interface DatesMedicine {
    admissionDate: Date;
    expirationDate: Date;
}

export interface Store {
    id: number;
    name: string;
    address: string;
    amount: number;
}
