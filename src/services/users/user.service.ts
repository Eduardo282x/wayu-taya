import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api"
import { UsersBody, UsersBodyPassword } from "./user.interface";

const usersUrl = "/users";

export const getUsers = async () => {
    return await getDataApi(usersUrl);
}
export const getRoles = async () => {
    return await getDataApi(`${usersUrl}/roles`)
}
export const postUsers = async (data: UsersBody) => {
    return await postDataApi(usersUrl, data)
}
export const putUsers = async (id: number, data: UsersBody) => {
    return await putDataApi(`${usersUrl}/${id}`, data)
}
export const putProfile = async (id: number, data: UsersBody) => {
    return await putDataApi(`${usersUrl}/profile/${id}`, data)
}
export const putPassword = async (id: number, data: UsersBodyPassword) => {
    return await putDataApi(`${usersUrl}/password/${id}`, data)
}
export const deleteUsers = async (id: number) => {
    return await deleteDataApi(`${usersUrl}/${id}`)
}
