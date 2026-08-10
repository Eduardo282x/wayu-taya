import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api.service"
import { InstitutionContent, IInstitution, InstitutionsBody, ParishContent } from "./institution.interface";

const institutionsUrl = "/institutions";
const parishUrl = "/parroquias";

export const getInstitutions = async (): Promise<InstitutionContent> => {
    const response = await getDataApi<InstitutionContent>(institutionsUrl);
    if (response.data == null) {
        return { institutions: [] }
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
