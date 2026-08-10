import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api.service"
import { GroupProviders, IProviders, ProviderBody } from "./provider.interface";

const providersUrl = "/proveedores";

export const getProviders = async (): Promise<GroupProviders> => {
    const response = await getDataApi<GroupProviders>(providersUrl);
    if (response.data == null) {
        return { allProviders: [], providers: [] }
    }
    return response.data;
}

export const postProviders = async (data: ProviderBody): Promise<IProviders | null> => {
    const response = await postDataApi<ProviderBody, IProviders>(providersUrl, data);
    return response.data;
}

export const putProviders = async (id: number, data: ProviderBody): Promise<IProviders | null> => {
    const response = await putDataApi<ProviderBody, IProviders>(`${providersUrl}/${id}`, data);
    return response.data;
}

export const deleteProviders = async (id: number): Promise<IProviders | null> => {
    const response = await deleteDataApi<IProviders>(`${providersUrl}/${id}`);
    return response.data;
}
