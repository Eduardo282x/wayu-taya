import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api.service"
import { IStore, StoreBody, StoreContent } from "./store.interface";
import type { BaseResponse } from "@/services/base.interface";

const storeUrl = "/store";

export const getStore = async (): Promise<StoreContent> => {
    const response = await getDataApi<StoreContent>(storeUrl);
    if (response.data == null) {
        return { stores: [] }
    }
    return response.data;
}

export const postStore = async (data: StoreBody): Promise<BaseResponse<IStore | null>> => {
    return postDataApi<StoreBody, IStore>(storeUrl, data)
}

export const putStore = async (id: number, data: StoreBody): Promise<BaseResponse<IStore | null>> => {
    return putDataApi<StoreBody, IStore>(`${storeUrl}/${id}`, data)
}

export const deleteStore = async (id: number): Promise<BaseResponse<IStore | null>> => {
    return deleteDataApi<IStore>(`${storeUrl}/${id}`)
}
