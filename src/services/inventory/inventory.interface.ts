import { IMedicine } from "../medicine/medicine.interface";
import { IStore } from "../store/store.interface";
import { PaginationMeta, PaginationQuery } from "../base.interface";

export interface InventoryContent {
    inventory: IInventory[];
}

export interface InventoryQueryParams extends PaginationQuery {
    name?: string;
    storeId?: number | null;
}

export interface PaginatedInventoryContent {
    inventory: IInventory[];
    pagination: PaginationMeta;
}

export interface IInventory {
    id: number;
    medicine: IMedicine;
    totalStock: number;
    stores: IStore[];
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

export interface InventoryHistoryContent {
    history: IInventoryHistory[]
}

export interface InventoryHistoryQueryParams extends PaginationQuery {
    name?: string;
    storeId?: number | null;
}

export interface PaginatedInventoryHistoryContent {
    history: IInventoryHistory[];
    pagination: PaginationMeta;
}

export interface InventoryAlertsQueryParams {
    days?: number;
    minStock?: number;
    storeId?: number | null;
}

export interface ExpiringLote {
    medicineId: number;
    medicineName: string;
    presentation?: string;
    lote: string;
    storeId: number;
    storeName: string;
    expirationDate: Date | string;
    amount: number;
    daysUntilExpiration?: number;
}

export interface LowStockItem {
    medicineId: number;
    medicineName: string;
    presentation?: string;
    storeId: number;
    storeName: string;
    stock: number;
    minStock?: number;
}

/**
 * Contrato esperado de `GET /inventory/alerts` (correccion 40 del backend).
 * El panel tolera que falte cualquiera de las dos listas.
 */
export interface InventoryAlertsContent {
    expiringLotes: ExpiringLote[];
    lowStock: LowStockItem[];
}

export interface MovementItem {
    medicineId: string | number;
    sourceStoreId: string | number;
    quantity: number;
    targetStoreId: string | number;
}

export interface MoveMedicineFormData {
    movements: MovementItem[];
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
    store: IStore;
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
