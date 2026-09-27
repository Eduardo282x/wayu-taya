import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

import { Snackbar } from "@/components/snackbar/Snackbar";
import { api } from "@/services/api.service";
import { isRefreshableError, isTerminalSessionError } from "@/services/api-error";
import { clearSessionSilently, refreshAccessToken, SESSION_EXPIRED_EVENT } from "@/services/auth/session";
import { getSession } from "@/store/auth.store";
import type { BaseResponse } from "@/services/base.interface";

/**
 * Extende la config de axios con una marca propia para no reintentar dos veces
 * la misma peticion.
 */
type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

/**
 * Rutas que nunca disparan refresh, ni aunque digan "Token invalido o
 * expirado". Son las que participan en el propio ciclo de vida de la sesion:
 * refrescarlas desde su propia respuesta de error solo genera bucles.
 */
const NO_REFRESH_PATHS = ["/auth/login", "/auth/refresh", "/auth/logout", "/auth/change-password"];

const isNoRefreshPath = (url: string | undefined): boolean => {
    if (!url) return true;
    return NO_REFRESH_PATHS.some((path) => url.includes(path));
};

const isValidMessage = (message: unknown): message is string =>
    typeof message === "string" && message.trim().length > 2;

const notifySuccess = (response: { config?: { method?: string }; data?: unknown }) => {
    if (!["post", "put", "delete"].includes(response.config?.method ?? "")) return;

    const body = response.data as BaseResponse<unknown> | undefined;
    if (!isValidMessage(body?.message)) return;

    toast.success(body.message, { duration: 4000, position: "top-right" });
};

const notifyError = (error: AxiosError) => {
    const status = error.response?.status;
    const body = error.response?.data as BaseResponse<unknown> | undefined;

    if (!isValidMessage(body?.message)) return;

    // Un 429 merece una parada visible y larga, sin reintentos: el limite se
    // agrava si se insiste. Los 401/403 tambien se avisan siempre, incluso en
    // GET, porque son accionables.
    if (status === 429) {
        toast.custom(<Snackbar success={false} message={body.message} />, {
            duration: 6000,
            position: "top-right",
        });
        return;
    }

    if (status === 401 || status === 403) {
        toast.custom(<Snackbar success={false} message={body.message} />, {
            duration: 4000,
            position: "top-right",
        });
        return;
    }

    if (!["post", "put", "delete"].includes(error.config?.method ?? "")) return;

    toast.error(body.message, { duration: 1500, position: "top-right" });
};

let registered = false;

/**
 * Registra el interceptor de peticion (inyecta Authorization) y el de
 * respuesta (refresh con una sola peticion en vuelo + avisos).
 *
 * Se registra a nivel de modulo desde main.tsx, antes de montar React, para que
 * no haya ninguna peticion sin cabecera. El interceptor de respuesta se
 * unifica con el de avisos: dos response interceptores apuntando al mismo
 * error harian que el reintento se encadenara de forma impredecible.
 */
export const registerAuthInterceptors = (): void => {
    if (registered) return;
    registered = true;

    api.interceptors.request.use(
        (config: RetriableConfig) => {
            // Se lee del store EN EL MOMENTO del envio. Si se capturara al
            // instalar el interceptor se quedaria con el token viejo y todas
            // las peticiones fallarian tras el primer refresh.
            const token = getSession().accessToken;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => Promise.reject(error),
    );

    api.interceptors.response.use(
        (response) => {
            // El reintento tras un refresh ya tuvo su exito: no se repite el aviso.
            if (!(response.config as RetriableConfig)?._retried) {
                notifySuccess(response);
            }
            return response;
        },
        async (error: AxiosError) => {
            const config = error.config as RetriableConfig | undefined;
            const status = error.response?.status;
            const body = error.response?.data as BaseResponse<unknown> | undefined;

            if (!(config?._retried)) notifyError(error);

            const canAttemptRefresh =
                status === 401 &&
                Boolean(config) &&
                !config?._retried &&
                !isNoRefreshPath(config?.url) &&
                isRefreshableError(body ?? { statusCode: status ?? 0, message: "" });

            if (!canAttemptRefresh) {
                // Sesion incunable ("Refresh token invalido o expirado",
                // "Sesion revocada por seguridad", "La cuenta esta desactivada",
                // "Acceso denegado"): cerrar, no reintentar.
                if (body && isTerminalSessionError(body)) {
                    clearSessionSilently();
                    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
                }
                return Promise.reject(error);
            }

            // UNA sola promesa compartida: si cinco peticiones recibieron 401 a
            // la vez, las cinco esperan el mismo refresh.
            const refreshed = await refreshAccessToken();

            if (!refreshed) {
                // `refreshAccessToken` ya limpio store, cache y emitijo
                // SESSION_EXPIRED_EVENT en su interior: no se duplica aqui.
                return Promise.reject(error);
            }

            // Se marca antes de reintentar: un segundo 401 no debe refrescar otra vez.
            if (config) {
                config._retried = true;
                const token = getSession().accessToken;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }

            return api.request(config as RetriableConfig);
        },
    );
};
