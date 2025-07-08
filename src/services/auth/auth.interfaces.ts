export interface BodyLogin {
    username: string;
    password: string;
}

export interface BodyRecoverPassword {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface UserToken {
    id:       number;
    name:     string;
    lastName: string;
    correo:   string;
    username: string;
    password: string;
    rolId:    number;
    rol:      Rol;
}

export interface Rol {
    id:  number;
    rol: string;
}
