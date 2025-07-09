import { Column } from "@/components/table/table.interface";
import { IUsers } from "@/services/users/user.interface";
import { FiTrash2 } from "react-icons/fi";
import { MdEdit } from "react-icons/md";

export const usersColumns: Column[] = [
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
        element: (data: IUsers) => data.rol.rol,
        isIcon: false,
        visible: true
    },
    {
        label: 'Editar',
        column: 'edit',
        element: () => '',
        icon: {
            icon: MdEdit,
            label: 'Editar usuario',
            className: 'text-blue-800 font-bold',
            variant: 'edit'
        },
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