import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api.service"
import { ProvidersContent, IProviders, ProviderBody, PaginatedProvidersContent, ProvidersQueryParams } from "./provider.interface";

const providersUrl = "/providers";

export const getProviders = async (): Promise<ProvidersContent> => {
    const response = await getDataApi<ProvidersContent>(providersUrl);
    if (response.data == null) {
        return { providers: [] }
    }
    return response.data;
}

export const getProvidersPage = async (params: ProvidersQueryParams): Promise<PaginatedProvidersContent> => {
    const queryParams: Record<string, string | number> = {
        page: params?.page ?? 1,
        size: params?.size ?? 100,
    };

    const response = await getDataApi<PaginatedProvidersContent>(providersUrl, { params: queryParams });
    if (response.data == null) {
        return {
            providers: [],
            page: params?.page ?? 1,
            size: params?.size ?? 100,
            total: 0,
            totalPages: 0,
        }
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
