import { deleteDataApi, getDataApi, putDataApi } from "@/services/api.service"
import type { BaseResponse } from "@/services/base.interface";
import {
    InventoryContent,
    InventoryHistoryQueryParams,
    InventoryQueryParams,
    InventorySummary,
    InventorySummaryQueryParams,
    MoveMedicineFormData,
    PaginatedInventoryContent,
    PaginatedInventoryHistoryContent,
} from "./inventory.interface";

const inventoryUrl = "/inventory";

const buildInventoryFilterParams = (params?: InventorySummaryQueryParams): Record<string, string | number> => {
    const queryParams: Record<string, string | number> = {};

    if (params?.name) queryParams.name = params.name;
    if (params?.storeId != null) queryParams.storeId = params.storeId;

    return queryParams;
}

export const getInventory = async (): Promise<InventoryContent> => {
    const response = await getDataApi<InventoryContent>(inventoryUrl);
    if (response.data == null) {
        return { inventory: [] }
    }
    return response.data;
}

export const getInventoryPage = async (params: InventoryQueryParams): Promise<PaginatedInventoryContent> => {
    const queryParams: Record<string, string | number> = {
        page: params?.page ?? 1,
        size: params?.size ?? 100,
        ...buildInventoryFilterParams(params),
    };

    const response = await getDataApi<PaginatedInventoryContent>(inventoryUrl, { params: queryParams });
    if (response.data == null) {
        return {
            inventory: [],
            pagination: {
                total: 0,
                page: params?.page ?? 1,
                size: params?.size ?? 100,
                totalPages: 0,
            },
        }
    }
    return response.data;
}

export const getInventorySummary = async (params?: InventorySummaryQueryParams): Promise<InventorySummary | null> => {
    const response = await getDataApi<InventorySummary>(`${inventoryUrl}/summary`, {
        params: buildInventoryFilterParams(params),
    });
    return response.data ?? null;
}

export const getInventoryHistorial = async (
    params?: InventoryHistoryQueryParams,
): Promise<PaginatedInventoryHistoryContent> => {
    const queryParams: Record<string, string | number> = {
        page: params?.page ?? 1,
        size: params?.size ?? 100,
        ...buildInventoryFilterParams(params),
    };

    const response = await getDataApi<PaginatedInventoryHistoryContent>(`${inventoryUrl}/historial`, {
        params: queryParams,
    });
    if (response.data == null) {
        return {
            history: [],
            pagination: {
                total: 0,
                page: params?.page ?? 1,
                size: params?.size ?? 100,
                totalPages: 0,
            },
        }
    }
    return response.data;
}

export const moveInventoryStorage = async (
    data: MoveMedicineFormData,
): Promise<BaseResponse<unknown>> => {
    return putDataApi<MoveMedicineFormData, unknown>(`${inventoryUrl}/move`, data);
}

export const deleteInventory = async (id: number): Promise<unknown> => {
    const response = await deleteDataApi<unknown>(`${inventoryUrl}/${id}`);
    return response.data;
}
