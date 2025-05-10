import {z} from 'zod'

export const userSchema = z.object({
    user: z.string().min(3, {
        message: "El usuario debe tener minimo 3 caracteres de longitud"
    })
    .max(30, {message:"El usuario debe tener maximo 30 caracteres de longitud"}),

    password: z.string().min(4, {
        message: "La contraseña debe tener minimo 4 caracteres de longitud"
    })
    .max(30, {message:"La contraseña debe tener maximo 30 caracteres de longitud"})
});