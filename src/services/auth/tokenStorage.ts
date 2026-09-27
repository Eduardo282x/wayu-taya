/**
 * Unico modulo autorizado a tocar `sessionStorage`, y solo para el
 * refreshToken.
 *
 *  - accessToken: SOLO en memoria (store de zustand). Nunca se persiste.
 *  - refreshToken: sessionStorage, para que la sesion sobreviva a recargar o
 *    reabrir la pestana pero muera al cerrarla.
 *  - Nunca en localStorage, en la URL, en la consola ni en un archivo.
 */
const REFRESH_TOKEN_KEY = "wt_refresh_token";

/** Clave que usaba la version anterior (zustand `persist`). Se borra al migrar. */
const LEGACY_PERSIST_KEY = "auth-storage";

const getSessionStorage = (): Storage | null => {
    try {
        if (typeof window === "undefined") return null;
        return window.sessionStorage;
    } catch {
        // Safari en modo privado y contextos sin almacenamiento launched.
        return null;
    }
};

export const readRefreshToken = (): string | null => {
    const storage = getSessionStorage();
    if (!storage) return null;

    try {
        return storage.getItem(REFRESH_TOKEN_KEY);
    } catch {
        return null;
    }
};

export const writeRefreshToken = (token: string): void => {
    const storage = getSessionStorage();
    if (!storage) return;

    try {
        storage.setItem(REFRESH_TOKEN_KEY, token);
    } catch {
        // Sin espacio o cuota excedida: se sigue en memoria, la sesion no sobrevive.
    }
};

export const clearRefreshToken = (): void => {
    const storage = getSessionStorage();
    if (!storage) return;

    try {
        storage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
        // Nada que hacer.
    }
};

/**
 * Limpia el sobre que escribia la version anterior en localStorage: contenia
 * el accessToken en claro. Se ejecuta una vez al arrancar.
 */
export const purgeLegacyTokenStorage = (): void => {
    try {
        if (typeof window === "undefined") return;
        window.localStorage.removeItem(LEGACY_PERSIST_KEY);
    } catch {
        // Nada que hacer.
    }
};
