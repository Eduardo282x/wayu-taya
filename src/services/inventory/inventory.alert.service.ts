import { getDataApi } from "@/services/api.service"
import { InventoryAlertsContent, InventoryAlertsQueryParams } from "./inventory.interface"

const inventoryUrl = "/inventory";

export const getInventoryAlerts = async (
    params?: InventoryAlertsQueryParams,
): Promise<InventoryAlertsContent> => {
    const queryParams: Record<string, string | number> = {};

    if (params?.days != null) queryParams.days = params.days;
    if (params?.minStock != null) queryParams.minStock = params.minStock;
    if (params?.storeId != null) queryParams.storeId = params.storeId;

    const response = await getDataApi<InventoryAlertsContent>(`${inventoryUrl}/alerts`, {
        params: queryParams,
    });

    if (response.data == null) {
        return { expiringLotes: [], lowStock: [] };
    }

    return response.data;
}
