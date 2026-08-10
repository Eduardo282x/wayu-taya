import { User } from "@/services/auth/auth.interfaces";

export const baseUser: User = {
    id: 0,
    name: '',
    lastName: '',
    correo: '',
    username: '',
    rol: {
        rol: '',
        id: 0
    },
    rolId: 1
}