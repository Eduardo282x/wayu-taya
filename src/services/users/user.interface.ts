/**
 * Tipo de rol con id, tal y como lo devuelve `GET /api/users/roles`.
 * Se usa para poblar el selector al crear o editar un usuario.
 */
export interface Role {
    id: number;
    rol: string;
}

/**
 * Fila de `GET /api/users`.
 *
 * OJO: el listado NO incluye `rolId`. Solo trae el rol ya anidado por nombre
 * (`rol.rol`), asi que para editar hay que resolver el `rolId` cruzando contra
 * `GET /api/users/roles`.
 */
export interface IUsers {
    id: number;
    name: string;
    lastName: string;
    correo: string;
    username: string;
    /** Solo el nombre del rol: el listado no devuelve `rolId` ni el id del rol. */
    rol: { rol: string };
}

/**
 * `POST /api/users` y `PUT /api/users/:id` comparten el mismo DTO.
 *
 * IMPORTANTE: la edicion NO acepta `password`. `forbidNonWhitelisted` esta
 * activo, asi que mandarla devuelve 400 por campo desconocido, no se ignora en
 * silencio. Para cambiar la contrasena de un usuario esta
 * `PUT /api/users/password/:id`.
 */
export interface UsersBody {
    username: string;
    name: string;
    lastName: string;
    correo: string;
    rolId: number;
    /** Solo al crear. Si se omite, el backend genera una temporal. */
    password?: string;
}

export interface UsersBodyPassword {
    newPassword: string;
}

/**
 * `PUT /api/users/me` acepta SOLO estos tres campos. Anyadir el correo hace que
 * la API responda 400.
 */
export interface ProfileBody {
    username: string;
    name: string;
    lastName: string;
}

export interface UsersContent {
    users: IUsers[];
}

export interface RolesContent {
    roles: Role[];
}

export interface CreateUserContent {
    user: IUsers;
    /** Solo viene si el admin no indicó una contrasena. */
    temporaryPassword?: string;
}

export interface UpdateUserContent {
    user: IUsers;
}

export interface UpdateProfileContent {
    user: IUsers;
}

export interface UpdatePasswordContent {
    user: IUsers;
}
