import { deleteDataApi, getDataApi } from "@/services/api"
// import { InventoryBody } from "./user.interface";

const inventoryUrl = "/inventory";

export const getInventory = async () => {
    return await getDataApi(inventoryUrl);
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
