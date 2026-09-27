import { deleteDataApi, getDataApi, postDataApi, putDataApi } from "@/services/api.service";
import type { BaseResponse } from "@/services/base.interface";
import type { IUsers } from "./user.interface";
import type {
    CreateUserContent,
    ProfileBody,
    RolesContent,
    UpdatePasswordContent,
    UpdateProfileContent,
    UpdateUserContent,
    UsersBody,
    UsersBodyPassword,
    UsersContent,
} from "./user.interface";

const usersUrl = "/users";

export const getUsers = async (): Promise<UsersContent> => {
    const response = await getDataApi<UsersContent>(usersUrl);
    if (response.data == null) {
        return { users: [] };
    }
    return response.data;
};

export const getRoles = async (): Promise<RolesContent> => {
    const response = await getDataApi<RolesContent>(`${usersUrl}/roles`);
    if (response.data == null) {
        return { roles: [] };
    }
    return response.data;
};

/**
 * Perfil del usuario autenticado. Toma el id del JWT: no lleva parametro de
 * ruta, y por eso no puede devolverse el perfil de otra persona.
 *
 * `data` es el objeto de usuario DIRECTO, no envuelto en `{ user }`.
 */
export const getMe = async (): Promise<BaseResponse<IUsers | null>> => getDataApi<IUsers>(`${usersUrl}/me`);

/**
 * Actualiza el perfil propio. Acepta SOLO username, name y lastName.
 *
 * Es `me` y no `profile/:id`: la ruta antigua ya no existe, y mandar el correo
 * (que venia incluido en el objeto de usuario completo) hace que la API
 * responda 400 con `whitelistValidation`.
 */
export const putProfile = async (data: ProfileBody): Promise<BaseResponse<UpdateProfileContent | null>> =>
    putDataApi<ProfileBody, UpdateProfileContent>(`${usersUrl}/me`, data);

export const postUsers = async (data: UsersBody): Promise<BaseResponse<CreateUserContent | null>> =>
    postDataApi<UsersBody, CreateUserContent>(usersUrl, data);

/**
 * `data` no debe llevar `password`: la edicion ya no la acepta. Para cambiarla
 * esta `putUserPassword`.
 */
export const putUsers = async (id: number, data: UsersBody): Promise<BaseResponse<UpdateUserContent | null>> =>
    putDataApi<UsersBody, UpdateUserContent>(`${usersUrl}/${id}`, data);

/** Cambio administrativo de la contrasena de otro usuario. Invalida sus sesiones. */
export const putUserPassword = async (
    id: number,
    data: UsersBodyPassword
): Promise<BaseResponse<UpdatePasswordContent | null>> =>
    putDataApi<UsersBodyPassword, UpdatePasswordContent>(`${usersUrl}/password/${id}`, data);

export const deleteUsers = async (id: number): Promise<BaseResponse<UpdateUserContent | null>> =>
    deleteDataApi<UpdateUserContent>(`${usersUrl}/${id}`);
