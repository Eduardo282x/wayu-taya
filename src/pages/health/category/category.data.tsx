import { Column } from "@/components/table/table.interface";
import { ICategory } from "@/services/medicine/medicine.interface";
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

export const categoryColumns: Column[] = [
  {
    label: "Categoría",
    column: "category",
    visible: true,
    isIcon: false,
    element: (data: ICategory) => data.category,
  },
  {
    label: "Editar",
    column: "edit",
    visible: true,
    isIcon: true,
    element: () => "",
    icon: {
      label: "Editar categoría",
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
      label: "Eliminar categoría",
      icon: FaRegTrashAlt,
      className: "text-red-600 cursor-pointer hover:text-red-800",
      variant: "ghost",
    },
  },
];
