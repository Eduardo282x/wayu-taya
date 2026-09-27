import { z } from "zod";

import { loginPasswordSchema, usernameSchema } from "@/lib/validation";

export interface Login {
    username: string;
    password: string;
}

/**
 * En el login solo se comprueba que el usuario tenga forma valida y que la
 * contrasena no este vacia: la complejidad NO se exige aqui porque puede haber
 * cuentas anteriores a las reglas actuales, y rechazarlas en cliente seria
 * dejar a alguien sin poder entrar.
 */
export const userSchema = z.object({
    username: usernameSchema,
    password: loginPasswordSchema,
});
