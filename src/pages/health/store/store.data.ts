import { Column } from "@/components/table/table.interface";
import { IAlmacen } from "@/pages/health/store/store.interface";
import { FiTrash2 } from "react-icons/fi";
import { MdEdit } from "react-icons/md";

export const almacenColumns: Column[] = [
    {
        label: 'Nombre del Almacén',
        column: 'nombre',
        element: (data: IAlmacen) => data.nombre,
        isIcon: false,
        visible: true
    },
    {
        label: 'Dirección',
        column: 'direccion',
        element: (data: IAlmacen) => data.direccion,
        isIcon: false,
        visible: true
    },
    {
        label: 'Editar',
        column: 'edit',
        element: () => '',
        icon: {
            icon: MdEdit,
            label: 'Editar almacén',
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
            label: 'Eliminar almacén',
            className: 'text-red-500 font-bold',
            variant: 'delete'
        },
        isIcon: true,
        visible: true
    }
];