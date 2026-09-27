import { postDataApi } from "../api.service";
import type { BaseResponse } from "../base.interface";
import type {
    ChangePasswordBody,
    ConfirmRecoverBody,
    LoginBody,
    LoginResponse,
    RecoverBody,
    RefreshBody,
    RefreshResponse,
} from "./auth.interfaces";

const authUrl = "/auth";

/**
 * Todos los endpoints de /auth son POST. Ninguno usa GET ni DELETE.
 *
 * Cuando la API responde `data: null` (logout, change-password, recover,
 * recover/confirm) lo unico que hay que leer es `message`.
 */
export const authLogin = (body: LoginBody): Promise<BaseResponse<LoginResponse | null>> =>
    postDataApi<LoginBody, LoginResponse>(`${authUrl}/login`, body);

/**
 * Rota el refreshToken: devuelve un par nuevo y revoca el anterior en el
 * servidor. Guardar SIEMPRE los dos tokens devueltos.
 *
 * Este mensaje llega vacio: no depender de `message` aqui.
 */
export const authRefresh = (refreshToken: string): Promise<BaseResponse<RefreshResponse | null>> =>
    postDataApi<RefreshBody, RefreshResponse>(`${authUrl}/refresh`, { refreshToken });

/** Idempotente y sin cabecera Authorization: llamarlo con un token invalido no da error. */
export const authLogout = (refreshToken: string): Promise<BaseResponse<null>> =>
    postDataApi<RefreshBody, null>(`${authUrl}/logout`, { refreshToken });

/**
 * Exige Authorization. Tras el 200 se revocan TODAS las sesiones, incluida la
 * actual, asi que despues hay que cerrar la sesion local sin pedir refresh.
 */
export const authChangePassword = (body: ChangePasswordBody): Promise<BaseResponse<null>> =>
    postDataApi<ChangePasswordBody, null>(`${authUrl}/change-password`, body);

/** Paso 1. Siempre 200 con el mismo mensaje, exista o no el correo. */
export const authRecover = (body: RecoverBody): Promise<BaseResponse<null>> =>
    postDataApi<RecoverBody, null>(`${authUrl}/recover`, body);

/** Paso 2. 400 "El enlace es invalido o ha expirado" si el token caduco o ya se uso. */
export const authConfirmRecover = (body: ConfirmRecoverBody): Promise<BaseResponse<null>> =>
    postDataApi<ConfirmRecoverBody, null>(`${authUrl}/recover/confirm`, body);
