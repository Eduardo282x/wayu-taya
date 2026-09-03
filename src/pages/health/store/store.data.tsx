import { Column } from "@/components/table/table.interface";
import { formatNumberWithDots } from "@/hooks/formaters";
import { IStore } from "@/services/store/store.interface";
import { FiTrash2 } from "react-icons/fi";
import { MdEdit } from "react-icons/md";

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
    label: "Capacidad",
    column: "capacity",
    element: (data: IStore) => (data.capacity != null ? `${formatNumberWithDots(data.capacity)}` : "-"),
    visible: true,
    isIcon: false,
  },
  {
    label: "Usado",
    column: "usedCapacity",
    element: (data: IStore) => (data.usedCapacity != null ? `${formatNumberWithDots(data.usedCapacity)}` : "-"),
    visible: true,
    isIcon: false,
  },
  {
    label: "Disponible",
    column: "availableCapacity",
    element: (data: IStore) => (data.availableCapacity != null ? `${formatNumberWithDots(data.availableCapacity)}` : "-"),
    visible: true,
    isIcon: false,
  },
  {
    label: "%",
    column: "capacityPercentage",
    element: (data: IStore) => (
      data.capacityPercentage != null ? (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          data.capacityPercentage >= 90
            ? 'bg-red-100 text-red-700'
            : data.capacityPercentage >= 70
              ? 'bg-orange-100 text-orange-700'
              : 'bg-green-100 text-green-700'
        }`}>
          {data.capacityPercentage}%
        </span>
      ) : "-"
    ),
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