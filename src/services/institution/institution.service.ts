import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api"
import { InstitutionsBody } from "./institution.interface";

const institutionsUrl = "/institutions";
const parishUrl = "/parroquias";

export const getInstitutions = async () => {
    return await getDataApi(institutionsUrl);
}
export const getParish = async () => {
    return await getDataApi(parishUrl);
}
export const postInstitutions = async (data: InstitutionsBody) => {
    return await postDataApi(institutionsUrl, data)
}
export const putInstitutions = async (id: number, data: InstitutionsBody) => {
    return await putDataApi(`${institutionsUrl}/${id}`, data)
}
export const deleteInstitutions = async (id: number) => {
    return await deleteDataApi(`${institutionsUrl}/${id}`)
}
