import { MoveMedicineFormData } from "@/pages/health/inventory/move-medicine-dialog";
import { deleteDataApi, getDataApi, putDataApi } from "@/services/api"
// import { InventoryBody } from "./user.interface";

const inventoryUrl = "/inventory";

export const getInventory = async () => {
    return await getDataApi(inventoryUrl);
}
export const getInventoryHistorial = async () => {
    return await getDataApi(`${inventoryUrl}/historial`)
}
export const moveInventoryStorage = async (data: MoveMedicineFormData) => {
    return await putDataApi(`${inventoryUrl}/move`, data)
}
// export const postInventory = async (data: InventoryBody) => {
//     return await postDataApi(inventoryUrl, data)
// }
// export const putInventory = async (id: number, data: InventoryBody) => {
//     return await putDataApi(`${inventoryUrl}/${id}`, data)
// }
export const deleteInventory = async (id: number) => {
    return await deleteDataApi(`${inventoryUrl}/${id}`)
}
