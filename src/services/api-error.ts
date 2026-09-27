import type { BaseResponse, ValidationFieldError } from "./base.interface";

/**
 * Utilidades para interpretar el `message` y el `data` de un error de la API.
 *
 * El mensaje viene del backend y ya esta localizado, asi que se muestra tal
 * cual. Lo que se hace aqui es DECIDIR QUE ACCION TOMAR segun el mensaje,
 * porque hay varios 401/403 con significado muy distinto:
 *
 *  - "Token invalido o expirado"      -> unico caso en el que se refresca
 *  - "Credenciales invalidas"         -> es del formulario de login, no del token
 *  - "La contrasena actual es incorrecta" -> es del formulario de cambio, no del token
 *  - "Refresh token invalido o expirado" / "Sesion revocada por seguridad"
 *                                     -> sesion muerta, cerrar
 */

/**
 * Sin acentos, en minusculas y sin puntuacion final, para comparar mensajes
 * sin depender de como los escriba el backend ("inválido" vs "invalido").
 */
const normalizeMessage = (message: string | undefined | null): string =>
    (message ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[.!]+$/, "");

const TOKEN_EXPIRED = "token invalido o expirado";

/** Sesion incunable: hay que cerrar, sin reintentar nada. */
const TERMINAL_SESSION = new Set([
    "refresh token invalido o expirado",
    "sesion revocada por seguridad",
    "la cuenta esta desactivada",
    "acceso denegado",
]);

/** El unico 401 que autoriza a pedir un token nuevo. */
export const isRefreshableError = (response: Pick<BaseResponse<unknown>, "statusCode" | "message">): boolean =>
    response.statusCode === 401 && normalizeMessage(response.message) === TOKEN_EXPIRED;

/** El 401/403 significa que la sesion ya no existe: limpiar y salir al login. */
export const isTerminalSessionError = (response: Pick<BaseResponse<unknown>, "statusCode" | "message">): boolean => {
    if (response.statusCode !== 401 && response.statusCode !== 403) return false;
    return TERMINAL_SESSION.has(normalizeMessage(response.message));
};

/**
 * Etiquetas legibles de los campos de auth y usuarios. El backend traduce los
 * constraints conocidos usando FIELD_LABELS, que no incluye estos campos, asi
 * que sus mensajes llegan como "newPassword presenta un valor invalido (minLength)".
 * Aqui se pone un nombre utilizable.
 */
const FIELD_LABELS: Record<string, string> = {
    username: "El usuario",
    currentPassword: "La contraseña actual",
    newPassword: "La nueva contraseña",
    password: "La contraseña",
    confirmPassword: "La confirmación",
    refreshToken: "El refresh token",
    token: "El token",
    email: "El correo",
    correo: "El correo",
    name: "El nombre",
    lastName: "El apellido",
    rolId: "El rol",
    roleId: "El rol",
};

/** `minLength`/`maxLength` del backend se traducen a algo legible. */
const CONSTRAINT_MESSAGES: Record<string, string> = {
    minLength: "no cumple con la longitud mínima permitida",
    maxLength: "supera la longitud máxima permitida",
    matches: "no cumple con el formato permitido",
    isEmail: "debe ser un correo válido",
    isInt: "debe ser un número entero",
    isNumber: "debe ser un número",
    isString: "debe ser un texto",
    isNotEmpty: "es requerido",
    isEmpty: "no puede estar vacío",
    whitelistValidation: "no es un campo permitido",
    forbidNonWhitelisted: "no es un campo permitido",
};

const cleanBackendMessage = (raw: string): string => {
    const [field, ...rest] = raw.split(":");
    const tail = rest.join(":").trim();

    if (!tail) return raw;

    const constraint = /\(([a-zA-Z]+)\)\s*$/.exec(tail);
    if (!constraint) return tail;

    const label = FIELD_LABELS[field.trim()] ?? field.trim();
    const translated = CONSTRAINT_MESSAGES[constraint[1]] ?? `es inválido (${constraint[1]})`;
    return `${label} ${translated}`;
};

/**
 * Convierte `data.errors` en `{ campo: mensaje }` para pintar los formularios.
 * `messages` llega como arreglo, pero se acepta string por si el backend
 * cambia; se normaliza a un unico mensaje por campo.
 */
export const getFieldErrors = (response: BaseResponse<unknown> | null | undefined): Record<string, string> => {
    const data = response?.data as { errors?: ValidationFieldError[] } | null | undefined;
    const errors = data?.errors;

    if (!Array.isArray(errors) || errors.length === 0) return {};

    return errors.reduce<Record<string, string>>((acc, error) => {
        if (!error?.field) return acc;

        const raw = Array.isArray(error.messages) ? error.messages.join(" ") : String(error.messages ?? "");
        const messages = raw
            .split(";")
            .map((part) => cleanBackendMessage(part.trim()))
            .filter(Boolean);

        acc[error.field] = messages.join(" ") || "valor no válido";
        return acc;
    }, {});
};

/**
 * El login se bloquea con "Demasiados intentos fallidos. Intenta de nuevo en
 * 15 minuto(s)." De ahi sale el tiempo de la cuenta regresiva. Si el mensaje no
 * es ese (por ejemplo el burst de 3/30s, que responde con el texto generico
 * de Nest), se usa un cooldown corto y conservador.
 */
const RETRY_MINUTES_PATTERN = /intenta de nuevo en\s*(\d+)\s*minuto/i;

export const getThrottleSeconds = (message: string | undefined | null, fallbackSeconds = 30): number => {
    if (!message) return fallbackSeconds;

    const match = RETRY_MINUTES_PATTERN.exec(message);
    if (!match) return fallbackSeconds;

    const minutes = Number.parseInt(match[1], 10);
    return Number.isFinite(minutes) && minutes > 0 ? minutes * 60 : fallbackSeconds;
};

/** El mensaje de la API ya viene localizado: se muestra tal cual. */
export const apiMessage = (response: BaseResponse<unknown> | null | undefined, fallback = "Ocurrió un error inesperado"): string => {
    const message = response?.message?.trim();
    return message && message.length > 0 ? message : fallback;
};
