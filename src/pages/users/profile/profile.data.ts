import { UserToken } from "@/services/auth/auth.interfaces";

export const baseUser: UserToken = {
    id: 0,
    name: '',
    lastName: '',
    correo: '',
    password: '',
    username: '',
    rol: {
        rol: '',
        id: 0
    },
    rolId: 1
}