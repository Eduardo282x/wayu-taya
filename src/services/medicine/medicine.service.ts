import { deleteDataApi, getDataApi, getDataFileApi, postDataApi, putDataApi } from "@/services/api"
import { MedicineBody } from "./medicine.interface";

const medicineUrl = "/medicine";

export const getMedicine = async () => {
    return await getDataApi(medicineUrl);
}
export const getCategories = async () => {
    return await getDataApi(`${medicineUrl}/category`);
}
export const postCategories = async (data: any) => {
    return await postDataApi(`${medicineUrl}/category`, data);
}
export const putCategories = async (id:number, data: any) => {
    return await putDataApi(`${medicineUrl}/category/${id}`,data);
}
export const getForms = async () => {
    return await getDataApi(`${medicineUrl}/forms`);
}
export const postForms = async (data: any) => {
    return await postDataApi(`${medicineUrl}/forms`, data);
}
export const putForms = async (id: number, data: any) => {
    return await putDataApi(`${medicineUrl}/forms/${id}`, data);
}
export const getMedicineTemplate = async () => {
    return await getDataFileApi(`${medicineUrl}/template`);
}
export const postMedicine = async (data: MedicineBody) => {
    return await postDataApi(medicineUrl, data)
}
export const putMedicine = async (id: number, data: MedicineBody) => {
    return await putDataApi(`${medicineUrl}/${id}`, data)
}
export const deleteMedicine = async (id: number) => {
    return await deleteDataApi(`${medicineUrl}/${id}`)
}
