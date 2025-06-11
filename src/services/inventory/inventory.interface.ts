import { IMedicine } from "../medicine/medicine.interface";

export interface IInventory {
    medicine:      IMedicine;
    totalStock:    number;
    stores:        Store[];
    datesMedicine: DatesMedicine[];
    lotes:         string[];
}

export interface DatesMedicine {
    admissionDate:  Date;
    expirationDate: Date;
}

export interface Store {
    id:      number;
    name:    string;
    address: string;
}
