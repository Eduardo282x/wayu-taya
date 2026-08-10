import { deleteDataApi, getDataApi, getDataFileApi, postDataApi, postFilesDataApi, putDataApi } from "@/services/api.service"
import { GroupCategory, GroupForm, GroupMedicine, ICategory, IForm, IMedicine, MedicineBody } from "./medicine.interface";

const medicineUrl = "/medicine";

export const getMedicine = async (): Promise<GroupMedicine> => {
    const response = await getDataApi<GroupMedicine>(medicineUrl);
    if (response.data == null) {
        return { allMedicine: [], medicine: [] }
    }
    return response.data;
}

export const getCategories = async (): Promise<GroupCategory> => {
    const response = await getDataApi<GroupCategory>(`${medicineUrl}/category`);
    if (response.data == null) {
        return { allCategories: [], categories: [] }
    }
    return response.data;
}

export const postCategories = async (data: ICategory): Promise<ICategory | null> => {
    const response = await postDataApi<ICategory, ICategory>(`${medicineUrl}/category`, data);
    return response.data;
}

export const putCategories = async (id: number, data: ICategory): Promise<ICategory | null> => {
    const response = await putDataApi<ICategory, ICategory>(`${medicineUrl}/category/${id}`, data);
    return response.data;
}

export const getForms = async (): Promise<GroupForm> => {
    const response = await getDataApi<GroupForm>(`${medicineUrl}/forms`);
    if (response.data == null) {
        return { allForms: [], forms: [] }
    }
    return response.data;
}

export const postForms = async (data: IForm): Promise<IForm | null> => {
    const response = await postDataApi<IForm, IForm>(`${medicineUrl}/forms`, data);
    return response.data;
}

export const putForms = async (id: number, data: IForm): Promise<IForm | null> => {
    const response = await putDataApi<IForm, IForm>(`${medicineUrl}/forms/${id}`, data);
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
