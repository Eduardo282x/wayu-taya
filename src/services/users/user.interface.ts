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

export interface GroupUsers {
    allUsers: IUsers[];
    users: IUsers[]
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
