import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api.service"
import { IStore, StoreBody, StoreContent } from "./store.interface";

const storeUrl = "/store";

export const getStore = async (): Promise<StoreContent> => {
    const response = await getDataApi<StoreContent>(storeUrl);
    if (response.data == null) {
        return { stores: [] }
    }
    return response.data;
}

export const postStore = async (data: StoreBody) => {
    return await postDataApi<StoreBody, IStore>(storeUrl, data)
}

export const putStore = async (id: number, data: StoreBody) => {
    return await putDataApi(`${storeUrl}/${id}`, data)
}

export const deleteStore = async (id: number) => {
    return await deleteDataApi(`${storeUrl}/${id}`)
}