export interface UsersBody {
    username: string;
    name: string;
    lastName: string;
    password: string;
    correo: string;
}
export interface UsersBodyPassword {
    newPassword: string;
}

export interface GroupUsers {
    allUsers: IUsers[];
    users: IUsers[]
}

export interface IUsers {
    id: number;
    name: string;
    lastName: string;
    correo: string;
    username: string;
    password: string;
}
