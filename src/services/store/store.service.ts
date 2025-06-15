import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api"
import { StoreBody } from "./store.interface"; 

const storeUrl = "/store"; 

export const getStore = async () => {
    return await getDataApi(storeUrl);
}

export const postStore = async (data: StoreBody) => {
    return await postDataApi(storeUrl, data)
}

export const putStore = async (id: number, data: StoreBody) => {
    return await putDataApi(`${storeUrl}/${id}`, data)
}

export const deleteStore = async (id: number) => {
    return await deleteDataApi(`${storeUrl}/${id}`)
}