import { Column } from "@/components/table/table.interface";
import { IForm } from "@/services/medicine/medicine.interface";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

export const formColumns: Column[] = [
  {
    label: "Forma",
    column: "forms",
    visible: true,
    isIcon: false,
    element: (data: IForm) => data.forms,
  },
  {
    label: "Editar",
    column: "edit",
    visible: true,
    isIcon: true,
    element: () => "",
    icon: {
      label: "Editar forma",
      icon: FaEdit,
      className: "text-blue-600 cursor-pointer hover:text-blue-800",
      variant: "ghost",
    },
  },
  {
    label: "Eliminar",
    column: "delete",
    visible: true,
    isIcon: true,
    element: () => "",
    icon: {
      label: "Eliminar forma",
      icon: FaRegTrashAlt,
      className: "text-red-600 cursor-pointer hover:text-red-800",
      variant: "ghost",
    },
  },
];
