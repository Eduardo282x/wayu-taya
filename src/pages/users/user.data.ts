import { Column } from "@/components/table/table.interface";
import { IUsers } from "@/services/users/user.interface";
import { FiTrash2, FiEdit2, FiKey } from "react-icons/fi";

/**
 * El listado no trae `rolId`, solo el nombre del rol anidado.
 */
export const getUsersColumns = (currentUserId?: number): Column[] => [
    {
        label: 'Nombre',
        column: 'name',
        element: (data: IUsers) => data.name,
        isIcon: false,
        visible: true
    },
    {
        label: 'Apellido',
        column: 'lastName',
        element: (data: IUsers) => data.lastName,
        isIcon: false,
        visible: true
    },
    {
        label: 'Usuario',
        column: 'username',
        element: (data: IUsers) => data.username,
        isIcon: false,
        visible: true
    },
    {
        label: 'Correo',
        column: 'correo',
        element: (data: IUsers) => data.correo,
        isIcon: false,
        visible: true
    },
    {
        label: 'Rol',
        column: 'rol.rol',
        element: (data: IUsers) => data.rol?.rol ?? '',
        isIcon: false,
        visible: true
    },
    {
        label: 'Editar',
        column: 'edit',
        element: () => '',
        icon: {
            icon: FiEdit2,
            label: 'Editar usuario',
            className: 'text-blue-800 font-bold',
            variant: 'edit'
        },
        isIcon: true,
        visible: true
    },
    {
        // Cambiar la contrasena de OTRO usuario va por
        // `PUT /users/password/:id`, no por la edicion: mandar la contrasena en
        // el PUT de edicion devuelve 400 por campo desconocido.
        label: 'Contraseña',
        column: 'password',
        element: () => '',
        icon: {
            icon: FiKey,
            label: 'Restablecer contraseña',
            className: 'text-amber-600 font-bold',
            variant: 'edit'
        },
        // La propia contraseña se cambia en /perfil, donde se pide la actual.
        hiddenIcon: (data: IUsers) => data.id === currentUserId,
        isIcon: true,
        visible: true
    },
    {
        label: 'Eliminar',
        column: 'delete',
        element: () => '',
        icon: {
            icon: FiTrash2,
            label: 'Eliminar usuario',
            className: 'text-red-500 font-bold',
            variant: 'delete'
        },
        isIcon: true,
        visible: true
    }
]
