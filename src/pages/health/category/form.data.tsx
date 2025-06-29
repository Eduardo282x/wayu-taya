// src/pages/health/category/form.data.tsx

import { Column } from "@/components/table/table.interface";
import { IForm } from "@/services/medicine/medicine.interface";
// import { IForm } from "@/services/category/category.interface"; // Importa IForm desde el mismo lugar
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";

export const formColumns: Column[] = [
  {
    label: "Forma",
    column: "name",
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
