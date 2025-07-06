import { z } from 'zod'

export const passwordSchema = z.object({
    email: z.string().email({
        message: "Ingresa un correo electrónico válido"
    }),

    password: z.string().min(4, {
        message: "La contraseña debe tener minimo 4 caracteres de longitud"
    })
        .max(30, { message: "La contraseña debe tener maximo 30 caracteres de longitud" }),

    confirmPassword: z.string().min(4, {
        message: "La contraseña debe tener minimo 4 caracteres de longitud"
    })
        .max(30, { message: "La contraseña debe tener maximo 30 caracteres de longitud" })

}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"], // Esto hace que el error se asocie al campo confirmPassword
});