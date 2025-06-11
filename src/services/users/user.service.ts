import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api"
import { UsersBody } from "./user.interface";

const usersUrl = "/users";

export const getUsers = async () => {
    return await getDataApi(usersUrl);
}
export const postUsers = async (data: UsersBody) => {
    return await postDataApi(usersUrl, data)
}
export const putUsers = async (id: number, data: UsersBody) => {
    return await putDataApi(`${usersUrl}/${id}`, data)
}
export const deleteUsers = async (id: number) => {
    return await deleteDataApi(`${usersUrl}/${id}`)
}
