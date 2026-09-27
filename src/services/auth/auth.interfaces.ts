/**
 * Proyeccion del usuario que devuelve la API.
 *
 * IMPORTANTE: el campo de rol es `rol` (TEXTO, p.ej. "Administrador"), no
 * `rolId`. El id del rol vive dentro del JWT, no en este objeto. Un `rol` puede
 * quedar viejo hasta 15 minutos si un admin cambia el rol de alguien, asi que
 * sirve para ocultar botones, nunca para decidir permisos: la API manda.
 */
export interface AuthUser {
    id: number;
    name: string;
    lastName: string;
    correo: string;
    username: string;
    rol: string;
}

/** Claims del accessToken. Solo se usan para saber si expiró. */
export interface JwtClaims {
    sub: number;
    username: string;
    name: string;
    lastName: string;
    rolId: number;
    rol: string;
    iat?: number;
    exp?: number;
}

export interface LoginBody {
    username: string;
    password: string;
}

export interface LoginResponse {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: string;
}

/** El refresh devuelve el mismo juego de tokens mas el usuario actualizado. */
export interface RefreshResponse {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: string;
}

/**
 * El refreshToken es opaco (NO es un JWT): no se decodifica ni se leen claims.
 * Solo se comprueba su longitud porque el backend valida 20..500.
 */
export interface RefreshBody {
    refreshToken: string;
}

export interface ChangePasswordBody {
    currentPassword: string;
    newPassword: string;
}

/** Paso 1: solo pide el correo. Nunca revela si esta registrado. */
export interface RecoverBody {
    email: string;
}

/** Paso 2: confirma con el token de un solo uso y la nueva contraseña. */
export interface ConfirmRecoverBody {
    token: string;
    password: string;
}
