export interface BodyLogin {
    username: string;
    password: string;
}

export interface BodyRecoverPassword {
    email: string;
    password: string;
    confirmPassword: string;
}


export interface LoginResponse {
    user:  User;
    token: string;
}

export interface User {
    id:       number;
    name:     string;
    lastName: string;
    correo:   string;
    username: string;
    rolId:    number;
    rol:      Rol;
}

export interface Rol {
    id:  number;
    rol: string;
}

export type Role = 'Super Admin' |
    'Administrador' |
    'Usuarios' | ''