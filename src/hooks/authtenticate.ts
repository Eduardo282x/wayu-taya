import { jwtDecode } from "jwt-decode";

import type { JwtClaims } from "@/services/auth/auth.interfaces";

/**
 * El refreshToken es opaco y no se decodifica. Esto solo aplica al accessToken,
 * que es un JWT, y unicamente para saber si ya expiro: la API sigue siendo la
 * fuente de verdad de los permisos y de la sesion.
 *
 * No se escribe nada en consola: un token en la consola es una credencial
 * filtrada.
 */
export const isAccessTokenExpired = (token: string | null | undefined): boolean => {
    if (!token) return true;

    try {
        const claims = jwtDecode<JwtClaims>(token);
        if (!claims?.exp) return false;
        return claims.exp * 1000 < Date.now();
    } catch {
        // Un token ilegible se trata como expirado: lo resolvera el 401.
        return true;
    }
};
