import { MoveMedicineFormData } from "@/pages/health/inventory/move-medicine-dialog";
import { deleteDataApi, getDataApi, putDataApi } from "@/services/api.service"
import { InventoryContent, InventoryHistoryContent } from "./inventory.interface";

const inventoryUrl = "/inventory";

export const getInventory = async (): Promise<InventoryContent> => {
    const response = await getDataApi<InventoryContent>(inventoryUrl);
    if (response.data == null) {
        return { inventory: [] }
    }
    return response.data;
}

export const getInventoryHistorial = async (): Promise<InventoryHistoryContent> => {
    const response = await getDataApi<InventoryHistoryContent>(`${inventoryUrl}/historial`);
    if (response.data == null) {
        return { history: [] }
    }
    return response.data;
}

export const moveInventoryStorage = async (data: MoveMedicineFormData): Promise<unknown> => {
    const response = await putDataApi<MoveMedicineFormData, unknown>(`${inventoryUrl}/move`, data);
    return response.data;
}

export const deleteInventory = async (id: number): Promise<unknown> => {
    const response = await deleteDataApi<unknown>(`${inventoryUrl}/${id}`);
    return response.data;
}
