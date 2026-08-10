export interface UsersBody {
    username: string;
    name: string;
    lastName: string;
    password: string;
    correo: string;
    rolId: number;
}
export interface UsersBodyPassword {
    newPassword: string;
}

export interface UsersContent {
    users: IUsers[]
}

export interface RolesContent {
    roles: Role[];
}

export interface Role {
    id: number;
    rol: string;
}

export interface IUsers {
    id: number;
    name: string;
    lastName: string;
    correo: string;
    username: string;
    rolId: number;
    rol: Role;
    password: string;
}


export interface IToken {
    id: number;
    name: string;
    lastName: string;
    username: string;
    rol: string;
    iat: number;
    exp: number;
}

export interface ITokenExp extends IToken {
    expired: boolean;
}
