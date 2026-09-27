import axios, { AxiosRequestConfig } from "axios";
import type { ApiErrorData, BaseResponse } from "./base.interface";

export const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    // El backend tiene `credentials: false` y solo acepta las cabeceras
    // Content-Type y Authorization. NUNCA activar withCredentials ni enviar
    // cookies: la sesion vive en la cabecera Authorization.
});

/**
 * Normaliza un error de axios al sobre de la API.
 *
 * Clave: `data` en un error NO es siempre null. Cuando la peticion llego al
 * backend, se devuelve SU sobre tal cual, y con el se conserva el detalle
 * (401 -> { message, error, statusCode }; 400 de validacion -> { errors: [...] }).
 * Antes se ponia `data: null` a pelo y se perdia `errors`, que es justamente
 * lo que permite marcar los campos del formulario.
 */
const getApiError = (error: unknown): BaseResponse<ApiErrorData> => {
    if (axios.isAxiosError(error)) {
        const body = error.response?.data as BaseResponse<ApiErrorData> | undefined;

        if (body && typeof body === "object" && "success" in body && "data" in body) {
            return {
                success: body.success ?? false,
                statusCode: body.statusCode ?? error.response?.status ?? 500,
                message: body.message || error.message || "Error de servidor",
                data: body.data ?? null,
            };
        }

        return {
            success: false,
            statusCode: error.response?.status ?? 500,
            message: error.message || "Error de servidor",
            data: null,
        };
    }

    return {
        success: false,
        statusCode: 500,
        message: "Error inesperado",
        data: null,
    };
};

/**
 * En la rama de error `data` contiene el detalle de la API, no el tipo `R`
 * esperado. Se devuelve con un unico cast reunion en este punto en lugar de
 * propagar `ApiErrorData` a los servicios que solo leen `data` cuando
 * `success` es true.
 */
const asEnvelope = <R>(error: unknown): BaseResponse<R | null> => getApiError(error) as BaseResponse<R | null>;

export const getDataApi = async <R>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<R | null>> => {
    try {
        const res = await api.get<BaseResponse<R>>(url, config);
        return res.data;
    } catch (error) {
        return asEnvelope<R>(error);
    }
};

export const getDataFileApi = (endpoint: string) => {
    return api
        .get(endpoint, { responseType: "blob" })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            return err.response?.data ?? new Blob();
        });
};

export const postDataApi = async <T, R>(url: string, data: T): Promise<BaseResponse<R | null>> => {
    try {
        const res = await api.post<BaseResponse<R>>(url, data).then((response) => response.data);
        return res;
    } catch (error: unknown) {
        return asEnvelope<R>(error);
    }
};

export const postFilesDataApi = (endpoint: string, formData: FormData) => {
    return api
        .post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => response.data)
        .catch((err) => err.response?.data ?? null);
};

export const postDataFileApi = (endpoint: string, data: unknown) => {
    return api
        .post(endpoint, data, { responseType: "blob" })
        .then((response) => response.data)
        .catch((err) => err.response?.data ?? new Blob());
};

export const putDataApi = async <T, R>(endpoint: string, data: T): Promise<BaseResponse<R | null>> => {
    try {
        const response = await api.put<BaseResponse<R>>(endpoint, data);
        return response.data;
    } catch (error: unknown) {
        return asEnvelope<R>(error);
    }
};

export const deleteDataApi = async <R>(endpoint: string): Promise<BaseResponse<R | null>> => {
    try {
        const response = await api.delete<BaseResponse<R>>(`${endpoint}`);
        return response.data;
    } catch (error: unknown) {
        return asEnvelope<R>(error);
    }
};
