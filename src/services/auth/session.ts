import axios from "axios";

import { queryClient } from "@/lib/queryClient";
import type { RefreshResponse } from "@/services/auth/auth.interfaces";
import { getSession } from "@/store/auth.store";
import type { BaseResponse } from "@/services/base.interface";

/**
 * Evento que dispara el cierre de sesion. Lo escucha un componente dentro del
 * router (AuthWatcher) para limpiar la cache y navegar. Se usa un evento en
 * lugar de llamar a `navigate` aqui para que los servicios no dependan de
 * react-router ni creen un ciclo de imports.
 */
export const SESSION_EXPIRED_EVENT = "wt:session-expired";

/**
 * refresh EN VOLO.
 *
 * Este es el punto critico de todo el flujo. El refreshToken ROTA en cada
 * refresh: si cinco peticiones reciben 401 a la vez y cada una lanza su propio
 * refresh, la primera renueva el token y las otras cuatro reusan el
 * refreshToken ya revocado, lo que dispara "Sesion revocada por seguridad" y
 * revoca la sesion completa.
 *
 * Por eso hay UNA sola promesa compartida: todas las peticiones que fallan
 * esperan exactamente la misma.
 */
let refreshInFlight: Promise<boolean> | null = null;

/** Cliente propio, sin interceptores, para no arrastrar la cola de refresh. */
const refreshClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

const parseRefreshResponse = (body: unknown): BaseResponse<RefreshResponse | null> => {
    if (body && typeof body === "object" && "success" in body && "data" in body) {
        return body as BaseResponse<RefreshResponse | null>;
    }

    return { success: false, statusCode: 500, message: "Respuesta inesperada del servidor", data: null };
};

const runRefresh = async (): Promise<boolean> => {
    const { refreshToken } = getSession();

    if (!refreshToken) {
        expireSession();
        return false;
    }

    try {
        // Se lee el sobre crudo: este cliente no pasa por `api`, asi que el
        // interceptor de respuesta no puede interceptar su propio refresh.
        const { data } = await refreshClient.post<BaseResponse<RefreshResponse | null>>("/auth/refresh", { refreshToken });
        const response = parseRefreshResponse(data);
        const payload = response.data;

        if (response.success && payload?.accessToken && payload.refreshToken) {
            // Se guardan LOS DOS tokens, no solo el accessToken: el refreshToken
            // anterior quedo revocado y el nuevo es el unico valido. La respuesta
            // tambien trae el usuario actualizado, por si un admin cambio el rol.
            getSession().setTokens(payload.accessToken, payload.refreshToken, payload.user);
            return true;
        }

        expireSession();
        return false;
    } catch {
        // Cualquier fallo (401 Refresh token invalido o expirado, 401 Sesion
        // revocada por seguridad, 401 La cuenta esta desactivada, red caida)
        // es irrecuperable: se cierra la sesion.
        expireSession();
        return false;
    }
};

/**
 * Refresca la sesion UNA sola vez, compartida por todas las peticiones que
 * Espera a esa misma promesa. Devuelve `true` si hay un accessToken nuevo
 * valido.
 */
export const refreshAccessToken = (): Promise<boolean> => {
    if (refreshInFlight) return refreshInFlight;

    const promise = runRefresh();

    refreshInFlight = promise;

    // Se cierra SIEMPRE, en exito y en error: una promesa colgada dejaria el
    // refresh bloqueado para el resto de la vida de la pestana.
    const release = () => {
        if (refreshInFlight === promise) refreshInFlight = null;
    };

    promise.then(release, release);

    return promise;
};

/**
 * Cierre por fallo irrecuperable: store, cache de TanStack Query y
 * sessionStorage. La navegacion la hace AuthWatcher al recibir el evento.
 */
const expireSession = (): void => {
    getSession().clearSession();
    queryClient.clear();
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};

/** Cierre voluntario (logout manual, cambio de contraseña). No emite evento. */
export const clearSessionSilently = (): void => {
    getSession().clearSession();
    queryClient.clear();
};
