import { useAuthStore } from "@/store/auth.store";
import axios, { AxiosRequestConfig } from "axios";
import { BaseResponse } from "./base.interface";

export const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

const getApiError = (error: unknown): BaseResponse<null> => {
    if (axios.isAxiosError(error)) {
        return {
            message: error.response?.data?.message || error.message || "Error de servidor",
            statusCode: error.response?.status || 500,
            success: false,
            data: null,
        };
    }

    return {
        message: "Error inesperado",
        statusCode: 500,
        success: false,
        data: null,
    };
};

export const getDataApi = async <R>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<R | null>> => {
    try {
        const res = await api.get<BaseResponse<R>>(url, config);
        return res.data;
    } catch (error) {
        return getApiError(error);
    }
};

export const getDataFileApi = (endpoint: string) => {
    return api.get(endpoint, {
        responseType: 'blob',
    },).then((response) => {
        return response.data;
    }).catch(err => {
        return err.response?.data ?? new Blob();
    })
};

export const postDataApi = async <T, R>(url: string, data: T): Promise<BaseResponse<R | null>> => {
    try {
        const res = await api.post<BaseResponse<R>>(url, data).then((response) => response.data);
        return res;
    } catch (error: unknown) {
        return getApiError(error);
    }
};

export const postFilesDataApi = (endpoint: string, formData: FormData) => {
    return api.post(endpoint, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }).then((response) => response.data).catch((err) => err.response?.data ?? null);
};

export const postDataFileApi = (endpoint: string, data: unknown) => {
    return api.post(endpoint, data, { responseType: 'blob' }).then((response) => response.data).catch((err) => err.response?.data ?? new Blob());
};

export const putDataApi = async <T, R>(endpoint: string, data: T): Promise<BaseResponse<R | null>> => {
    try {
        const response = await api.put<BaseResponse<R>>(endpoint, data);
        return response.data;
    } catch (error: unknown) {
        return getApiError(error);
    }
};

export const deleteDataApi = async <R>(endpoint: string): Promise<BaseResponse<R | null>> => {
    try {
        const response = await api.delete<BaseResponse<R>>(`${endpoint}`);
        return response.data;
    } catch (error: unknown) {
        return getApiError(error);
    };
};

// Interceptors
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token || localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// api.interceptors.response.use(
//     (res) => res,
//     (error) => {
//         if (error.response?.status === 401) {
//             useAuthStore.getState().clearSession();
//             window.location.href = "/login";
//         }
//         return Promise.reject(error);
//     },
// );