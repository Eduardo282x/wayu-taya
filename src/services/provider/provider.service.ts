import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api"
import { ProviderBody } from "./provider.interface";
import { getProviders, postProviders, putProviders, deleteProviders } from "@/services/provider/provider.service";

const providersUrl = "/proveedores";

export const getProviders = async () => {
    return await getDataApi("/proveedores");
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
