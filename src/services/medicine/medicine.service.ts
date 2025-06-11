import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api"
import { MedicineBody } from "./medicine.interface";

const medicineUrl = "/medicine";

export const getMedicine = async () => {
    return await getDataApi(medicineUrl);
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
