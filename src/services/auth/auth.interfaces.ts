import { Role } from "../users/user.interface";

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
    rol:      Role;
}
