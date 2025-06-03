import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api"
import { ProviderBody } from "./provider.interface";

const providersUrl = "/proveedores";

export const getProviders = async () => {
    return await getDataApi(providersUrl);
}
export const postProviders = async (data: ProviderBody) => {
    return await postDataApi(providersUrl, data)
}
export const putProviders = async (id: number, data: ProviderBody) => {
    return await putDataApi(`${providersUrl}/${id}`, data)
}
export const deleteProviders = async (id: number) => {
    return await deleteDataApi(`${providersUrl}/${id}`)
}
