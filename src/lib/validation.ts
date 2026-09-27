import { z } from "zod";

/**
 * Reglas de validacion en cliente, alineadas con los DTO del backend.
 *
 * Se aplican de inmediato, no solo al enviar: el usuario ve el requisito antes
 * de fallar. El backend sigue siendo la autoridad, pero con feedback tardio la
 * API se convierte en un simple ecot de errores.
 */

/**
 * Contrasena: 8 a 72 caracteres, con minuscula, mayuscula y numero.
 *
 * El maximo de 72 no es arbitrario: bcrypt trunca en silencio a 72 bytes, asi
 * que una contrasena mas larga pareceria aceptada pero solo se compararia su
 * primer bloque.
 */
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

export const passwordSchema = z
    .string()
    .min(PASSWORD_MIN, { message: `La contraseña debe tener al menos ${PASSWORD_MIN} caracteres` })
    .max(PASSWORD_MAX, { message: `La contraseña no puede superar los ${PASSWORD_MAX} caracteres` })
    .regex(/[a-z]/, { message: "La contraseña debe incluir al menos una minúscula" })
    .regex(/[A-Z]/, { message: "La contraseña debe incluir al menos una mayúscula" })
    .regex(/\d/, { message: "La contraseña debe incluir al menos un número" });

/**
 * La confirmacion pasa EXACTAMENTE las mismas reglas que la contrasena: si
 * solo comprobara que coinciden, se podrian confirmar dos contrasenas debiles.
 *
 * La coincidencia con la contrasena se comprueba aparte, con `refine` sobre el
 * objeto: son dos cosas distintas y asi el error cae sobre el campo correcto.
 */
export const confirmPasswordSchema = () =>
    z
        .string()
        .min(PASSWORD_MIN, { message: `La confirmación debe tener al menos ${PASSWORD_MIN} caracteres` })
        .max(PASSWORD_MAX, { message: `La confirmación no puede superar los ${PASSWORD_MAX} caracteres` })
        .regex(/[a-z]/, { message: "La confirmación debe incluir al menos una minúscula" })
        .regex(/[A-Z]/, { message: "La confirmación debe incluir al menos una mayúscula" })
        .regex(/\d/, { message: "La confirmación debe incluir al menos un número" });

/** En el login NO se exige complejidad: pueden existir cuentas antiguas. */
export const loginPasswordSchema = z
    .string()
    .min(1, { message: "La contraseña es requerida" })
    .max(PASSWORD_MAX, { message: `La contraseña no puede superar los ${PASSWORD_MAX} caracteres` });

/** 3 a 64, solo letras, numeros, punto, guion y guion bajo. Sin espacios ni acentos. */
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 64;

export const usernameSchema = z
    .string()
    .min(USERNAME_MIN, { message: `El usuario debe tener al menos ${USERNAME_MIN} caracteres` })
    .max(USERNAME_MAX, { message: `El usuario no puede superar los ${USERNAME_MAX} caracteres` })
    .regex(/^[a-zA-Z0-9._-]+$/, {
        message: "El usuario solo puede letras, números, punto, guion y guion bajo",
    });

export const EMAIL_MAX = 180;

export const emailSchema = z
    .string()
    .min(1, { message: "El correo es requerido" })
    .max(EMAIL_MAX, { message: `El correo no puede superar los ${EMAIL_MAX} caracteres` })
    .email({ message: "Debe ser un correo válido" });

/** Nombre y apellido: obligatorios, maximo 120. */
export const NAME_MAX = 120;

export const nameSchema = z
    .string()
    .min(1, { message: "El nombre es requerido" })
    .max(NAME_MAX, { message: `El nombre no puede superar los ${NAME_MAX} caracteres` });

export const lastNameSchema = z
    .string()
    .min(1, { message: "El apellido es requerido" })
    .max(NAME_MAX, { message: `El apellido no puede superar los ${NAME_MAX} caracteres` });

/** Token de recuperacion: 20 a 200. */
export const RECOVERY_TOKEN_MIN = 20;
export const RECOVERY_TOKEN_MAX = 200;

export const recoveryTokenSchema = z
    .string()
    .min(RECOVERY_TOKEN_MIN, { message: `El token debe tener al menos ${RECOVERY_TOKEN_MIN} caracteres` })
    .max(RECOVERY_TOKEN_MAX, { message: `El token no puede superar los ${RECOVERY_TOKEN_MAX} caracteres` });

/** Refreshtoken: 20 a 500. Solo para dar feedback, nunca se decodifica. */
export const REFRESH_TOKEN_MIN = 20;
export const REFRESH_TOKEN_MAX = 500;

/** Aviso de los requisitos mientras se escribe, sin bloquear el envio. */
export const PASSWORD_RULES = [
    `Entre ${PASSWORD_MIN} y ${PASSWORD_MAX} caracteres`,
    "Al menos una minúscula",
    "Al menos una mayúscula",
    "Al menos un número",
] as const;
