import { deleteDataApi, getDataApi, getDataFileApi, postDataApi, postFilesDataApi, putDataApi } from "@/services/api.service"
import { MedicineContent, IMedicine, MedicineBody, FormContent, CategoryContent, MedicineQueryParams, PaginatedMedicineContent } from "./medicine.interface";

const medicineUrl = "/medicine";

export const getMedicine = async (): Promise<MedicineContent> => {
    const response = await getDataApi<MedicineContent>(medicineUrl);
    if (response.data == null) {
        return { medicines: [] }
    }
    return response.data;
}

export const getMedicinesPage = async (params: MedicineQueryParams): Promise<PaginatedMedicineContent> => {
    const queryParams: Record<string, string | number> = {
        page: params?.page ?? 1,
        size: params?.size ?? 100,
    };

    if (params?.name) queryParams.name = params.name;

    const response = await getDataApi<PaginatedMedicineContent>(medicineUrl, { params: queryParams });
    if (response.data == null) {
        return {
            medicines: [],
            page: params?.page ?? 1,
            size: params?.size ?? 100,
            total: 0,
            totalPages: 0,
        }
    }
    return response.data;
}

export const getCategories = async (): Promise<CategoryContent> => {
    const response = await getDataApi<CategoryContent>(`${medicineUrl}/category`);
    if (response.data == null) {
        return { categories: [] }
    }
    return response.data;
}

export const getForms = async (): Promise<FormContent> => {
    const response = await getDataApi<FormContent>(`${medicineUrl}/forms`);
    if (response.data == null) {
        return { forms: [] }
    }
    return response.data;
}

export const getMedicineTemplate = () => {
    return getDataFileApi(`${medicineUrl}/template`);
}

export const postMedicine = async (data: MedicineBody): Promise<IMedicine | null> => {
    const response = await postDataApi<MedicineBody, IMedicine>(medicineUrl, data);
    return response.data;
}

export const uploadMedicineFile = (data: FormData) => {
    return postFilesDataApi(`${medicineUrl}/upload`, data)
}

export const putMedicine = async (id: number, data: MedicineBody): Promise<IMedicine | null> => {
    const response = await putDataApi<MedicineBody, IMedicine>(`${medicineUrl}/${id}`, data);
    return response.data;
}

export const deleteMedicine = async (id: number): Promise<IMedicine | null> => {
    const response = await deleteDataApi<IMedicine>(`${medicineUrl}/${id}`);
    return response.data;
}
