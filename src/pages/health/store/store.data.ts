import { Column } from "@/components/table/table.interface";
import { IStore } from "@/services/store/store.interface";
import { FiTrash2 } from "react-icons/fi";
import { MdEdit } from "react-icons/md";

export interface StoreData {
  name: string;
  address: string;
}

export const storeColumns: Column[] = [
  {
    label: "Almacén",
    column: "name",
    element: (data: IStore) => data.name,
    visible: true,
    isIcon: false,
  },
  {
    label: "Dirección",
    column: "address",
    element: (data: IStore) => data.address,
    visible: true,
    isIcon: false,
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