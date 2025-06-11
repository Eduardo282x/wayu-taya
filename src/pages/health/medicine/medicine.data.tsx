import { Column } from "@/components/table/table.interface";
import { IMedicine } from "@/services/medicine/medicine.interface";

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
];
