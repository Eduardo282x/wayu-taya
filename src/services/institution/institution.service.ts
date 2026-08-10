import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api.service"
import { GroupInstitution, IInstitution, InstitutionsBody, IParish } from "./institution.interface";

const institutionsUrl = "/institutions";
const parishUrl = "/parroquias";

export const getInstitutions = async (): Promise<GroupInstitution> => {
    const response = await getDataApi<GroupInstitution>(institutionsUrl);
    if (response.data == null) {
        return { allInstitution: [], institution: [] }
    }
    return response.data;
}

export const getParish = async (): Promise<IParish[]> => {
    const response = await getDataApi<IParish[]>(parishUrl);
    if (response.data == null) {
        return []
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
