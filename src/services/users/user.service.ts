import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api.service"
import { LoginResponse } from "../auth/auth.interfaces";
import { UsersContent, IUsers, UsersBody, UsersBodyPassword, RolesContent } from "./user.interface";

const usersUrl = "/users";

export const getUsers = async (): Promise<UsersContent> => {
    const response = await getDataApi<UsersContent>(usersUrl);
    if (response.data == null) {
        return { users: [] }
    }
    return response.data;
}

export const getRoles = async (): Promise<RolesContent> => {
    const response = await getDataApi<RolesContent>(`${usersUrl}/roles`);
    if (response.data == null) {
        return { roles: [] }
    }
    return response.data;
}

export const postUsers = async (data: UsersBody): Promise<IUsers | null> => {
    const response = await postDataApi<UsersBody, IUsers>(usersUrl, data);
    return response.data;
}

export const putUsers = async (id: number, data: UsersBody): Promise<IUsers | null> => {
    const response = await putDataApi<UsersBody, IUsers>(`${usersUrl}/${id}`, data);
    return response.data;
}

export const putProfile = async (id: number, data: Omit<UsersBody, "password">): Promise<LoginResponse | null> => {
    const response = await putDataApi<Omit<UsersBody, "password">, LoginResponse>(`${usersUrl}/profile/${id}`, data);
    return response.data;
}

export const putPassword = async (id: number, data: UsersBodyPassword): Promise<UsersBodyPassword | null> => {
    const response = await putDataApi<UsersBodyPassword, UsersBodyPassword>(`${usersUrl}/password/${id}`, data);
    return response.data;
}

export const deleteUsers = async (id: number): Promise<IUsers | null> => {
    const response = await deleteDataApi<IUsers>(`${usersUrl}/${id}`);
    return response.data;
}
