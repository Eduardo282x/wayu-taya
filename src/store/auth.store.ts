import { create } from "zustand";

import { authLogin, authLogout, authRefresh } from "@/services/auth/auth.service";
import type { AuthUser, LoginResponse } from "@/services/auth/auth.interfaces";
import {
    clearRefreshToken,
    purgeLegacyTokenStorage,
    readRefreshToken,
    writeRefreshToken,
} from "@/services/auth/tokenStorage";
import type { BaseResponse } from "@/services/base.interface";

/**
 * Store de sesion.
 *
 * SIN `persist`: el accessToken vive solo en memoria y se pierde al recargar,
 * que es exactamente lo que se quiere. El refreshToken si se conserva, en
 * sessionStorage (ver tokenStorage.ts). `hydrate()` lo recupera al arrancar.
 */
interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: AuthUser | null;
    isHydrated: boolean;

    /** Guarda SIEMPRE los dos tokens: el refreshToken anterior queda revocado. */
    setTokens: (accessToken: string, refreshToken: string, user?: AuthUser | null) => void;
    setUser: (user: AuthUser) => void;

    /** Recupera la sesion al arrancar. `true` si se pudo refrescar. */
    hydrate: () => Promise<boolean>;
    login: (username: string, password: string) => Promise<BaseResponse<LoginResponse | null>>;

    /** Avisa al backend y cierra la sesion local. Nunca falla. */
    logout: () => Promise<void>;
    /** Cierre local sin llamar a la API. */
    clearSession: () => void;
}

/**
 * `hydrate()` es idempotente y comparte la misma promesa entre llamadas
 * simultaneas.
 *
 * Sin esto, React StrictMode monta, desmonta y remonta los efectos en
 * desarrollo: las dos ejecuciones de `hydrate()` salen antes de que la primera
 * llegue a `set({ isHydrated: true })`, y se disparan DOS refreshes. Como el
 * backend rota el refreshToken, el segundo llega con un token ya revocado y
 * termina expulsando al usuario que si tenia sesion valida.
 *
 * No se reutiliza la promesa de `session.ts` porque ese modulo importa el store
 * para leer el estado: la dependencia seria circular.
 */
let hydrateInFlight: Promise<boolean> | null = null;

const runHydrate = async (): Promise<boolean> => {
    purgeLegacyTokenStorage();

    const stored = readRefreshToken();
    if (!stored) {
        useAuthStore.setState({ isHydrated: true, refreshToken: null });
        return false;
    }

    const response = await authRefresh(stored);
    const payload = response.data;

    if (response.success && payload?.accessToken && payload.refreshToken) {
        writeRefreshToken(payload.refreshToken);
        useAuthStore.setState({
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
            user: payload.user,
            isHydrated: true,
        });
        return true;
    }

    useAuthStore.getState().clearSession();
    useAuthStore.setState({ isHydrated: true });
    return false;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    isHydrated: false,

    setTokens: (accessToken, refreshToken, user) => {
        writeRefreshToken(refreshToken);
        set((state) => ({
            accessToken,
            refreshToken,
            user: user !== undefined ? user : state.user,
        }));
    },

    setUser: (user) => set({ user }),

    hydrate: async () => {
        // Si ya termino, no se vuelve a pedir un token: el refreshToken de la
        // sesion actual ya esta en memoria.
        if (get().isHydrated) {
            return get().accessToken !== null;
        }

        if (!hydrateInFlight) {
            hydrateInFlight = runHydrate().finally(() => {
                hydrateInFlight = null;
            });
        }

        return hydrateInFlight;
    },

    login: async (username, password) => {
        const response = await authLogin({ username, password });
        const payload = response.data;

        if (response.success && payload?.accessToken && payload.refreshToken) {
            get().setTokens(payload.accessToken, payload.refreshToken, payload.user);
        }

        return response;
    },

    logout: async () => {
        const { refreshToken } = get();

        // El logout es idempotente y no requiere Authorization. Un fallo de red
        // no debe impedir cerrar la sesion en local.
        if (refreshToken) {
            try {
                await authLogout(refreshToken);
            } catch {
                // Sesion cerrada igual en el servidor: el token dejara de servir.
            }
        }

        get().clearSession();
    },

    clearSession: () => {
        clearRefreshToken();
        set({ accessToken: null, refreshToken: null, user: null });
    },
}));

// ───────────────────────── Selectores derivados ─────────────────────────
//
// `isAuthenticated` y `rol` se derivan del estado en vez de guardarse como
// campos propios: asi no pueden quedar desincronizados del `user`.

export const selectUser = (state: AuthState): AuthUser | null => state.user;
export const selectAccessToken = (state: AuthState): string | null => state.accessToken;

export const selectIsAuthenticated = (state: AuthState): boolean =>
    Boolean(state.accessToken) && Boolean(state.user);

export const selectRol = (state: AuthState): string => state.user?.rol ?? "";

export const useUser = (): AuthUser | null => useAuthStore(selectUser);
export const useAccessToken = (): string | null => useAuthStore(selectAccessToken);
export const useIsAuthenticated = (): boolean => useAuthStore(selectIsAuthenticated);
export const useRol = (): string => useAuthStore(selectRol);

/**
 * Acceso sin React para el interceptor de peticiones, que vive fuera del
 * ciclo de componentes.
 */
export const getSession = () => useAuthStore.getState();
