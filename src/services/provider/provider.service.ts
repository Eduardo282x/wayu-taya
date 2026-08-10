import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api.service"
import { ProvidersContent, IProviders, ProviderBody } from "./provider.interface";

const providersUrl = "/providers";

export const getProviders = async (): Promise<ProvidersContent> => {
    const response = await getDataApi<ProvidersContent>(providersUrl);
    if (response.data == null) {
        return { providers: [] }
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
