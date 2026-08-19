import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api.service"
import { InstitutionContent, IInstitution, InstitutionsBody, ParishContent, PaginatedInstitutionsContent, InstitutionsQueryParams } from "./institution.interface";

const institutionsUrl = "/institutions";
const parishUrl = "/parroquias";

export const getInstitutions = async (): Promise<InstitutionContent> => {
    const response = await getDataApi<InstitutionContent>(institutionsUrl);
    if (response.data == null) {
        return { institutions: [] }
    }
    return response.data;
}

export const getInstitutionsPage = async (params: InstitutionsQueryParams): Promise<PaginatedInstitutionsContent> => {
    const queryParams: Record<string, string | number> = {
        page: params?.page ?? 1,
        size: params?.size ?? 100,
    };

    const response = await getDataApi<PaginatedInstitutionsContent>(institutionsUrl, { params: queryParams });
    if (response.data == null) {
        return {
            institutions: [],
            page: params?.page ?? 1,
            size: params?.size ?? 100,
            total: 0,
            totalPages: 0,
        }
    }
    return response.data;
}

export const getParish = async (): Promise<ParishContent> => {
    const response = await getDataApi<ParishContent>(parishUrl);
    if (response.data == null) {
        return { parishes: [] }
    }
    return response.data;
}

export const postInstitutions = async (data: InstitutionsBody): Promise<IInstitution | null> => {
    const response = await postDataApi<InstitutionsBody, IInstitution>(institutionsUrl, data);
    return response.data;
}

export const putInstitutions = async (id: number, data: InstitutionsBody): Promise<IInstitution | null> => {
    const response = await putDataApi<InstitutionsBody, IInstitution>(`${institutionsUrl}/${id}`, data);
    return response.data;
}

export const deleteInstitutions = async (id: number): Promise<IInstitution | null> => {
    const response = await deleteDataApi<IInstitution>(`${institutionsUrl}/${id}`);
    return response.data;
}
