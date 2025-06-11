import { Column } from "@/interfaces/table.interface";
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
    column: "name",
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
    visible: true,
    isIcon: false,
  },
  {
    label: "Cantidad",
    column: "amount",
    element: (data: IMedicine) => data.amount ? data.amount.toString() : '-',
    visible: true,
    isIcon: false,
  },
  {
    label: "Temperatura",
    column: "temperate",
    element: (data: IMedicine) => data.temperate ? data.temperate : '-',
    visible: true,
    isIcon: false,
  },
  {
    label: "Manufactura",
    column: "manufacturer",
    element: (data: IMedicine) => data.manufacturer ? data.manufacturer : '-',
    visible: true,
    isIcon: false,
  },
  {
    label: "Principio Activo",
    column: "activeIngredient",
    element: (data: IMedicine) => data.activeIngredient ? data.activeIngredient : '-',
    visible: true,
    isIcon: false,
  },
  {
    label: "Forma",
    column: "form.forms",
    element: (data: IMedicine) => data.form ? data.form.forms : '-',
    visible: true,
    isIcon: false,
  },
];
