import { Column } from "@/components/table/table.interface";
import { IMedicine, MedicineBody } from "@/services/medicine/medicine.interface";
import { FiTrash2 } from "react-icons/fi";
import { MdEdit } from "react-icons/md";

export const medicineColumns: Column[] = [
  {
    label: "Nombre",
    column: "name",
    element: (data: IMedicine) => data.name,
    visible: true,
    isIcon: false,
  },
  {
    label: "Descripción",
    column: "description",
    element: (data: IMedicine) => data.description,
    visible: true,
    isIcon: false,
  },
  {
    label: "Categoría",
    column: "category.category",
    element: (data: IMedicine) => data.category.category,
    visible: true,
    isIcon: false,
  },
  {
    label: "Medicina",
    column: "medicine",
    element: (data: IMedicine) => (data.medicine ? "Sí" : "No"),
    visible: true,
    isIcon: false,
  },
  {
    label: "Unidad",
    column: "unit",
    element: (data: IMedicine) => data.unit ? data.unit : '-',
    visible: false,
    isIcon: false,
  },
  {
    label: "Cantidad",
    column: "amount",
    element: (data: IMedicine) => data.amount ? data.amount.toString() : '-',
    visible: false,
    isIcon: false,
  },
  {
    label: "Temperatura",
    column: "temperate",
    element: (data: IMedicine) => data.temperate ? data.temperate : '-',
    visible: false,
    isIcon: false,
  },
  {
    label: "Manufactura",
    column: "manufacturer",
    element: (data: IMedicine) => data.manufacturer ? data.manufacturer : '-',
    visible: false,
    isIcon: false,
  },
  {
    label: "Principio Activo",
    column: "activeIngredient",
    element: (data: IMedicine) => data.activeIngredient ? data.activeIngredient : '-',
    visible: false,
    isIcon: false,
  },
  {
    label: "Forma",
    column: "form.forms",
    element: (data: IMedicine) => data.form ? data.form.forms : '-',
    visible: false,
    isIcon: false,
  },
  {
    label: 'Editar',
    column: 'edit',
    element: () => '',
    icon: {
      icon: MdEdit,
      label: 'Editar medicina',
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
      label: 'Eliminar medicina',
      className: 'text-red-500 font-bold',
      variant: 'delete'
    },
    isIcon: true,
    visible: true
  }
];

export const baseMedicine: MedicineBody = {
  name: "",
  description: "",
  categoryId: 0,
  medicine: true,
  unit: "",
  amount: 0,
  temperate: "",
  manufacturer: "",
  activeIngredient: "",
  formId: 0,
  benefited: 1,
}
