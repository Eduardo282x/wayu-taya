import { Column } from "@/components/table/table.interface"
import { IInventory } from "@/services/inventory/inventory.interface";
import { formatDate } from "@/utils/formatters"
import { FaRegTrashAlt } from "react-icons/fa"

export const inventoryColumns: Column[] = [
  {
    label: "Medicina",
    column: "medicine.name",
    visible: true,
    isIcon: false,
    element: (data: IInventory) => `${data.medicine.name} ${data.medicine.amount}${data.medicine.unit}`,
  },
  {
    label: "Cantidad",
    column: "totalStock",
    visible: true,
    isIcon: false,
    element: (data: IInventory) => `${data.totalStock} unidades`,
  },
  {
    label: "Fecha de Llegada",
    column: "admissionDate",
    visible: true,
    isIcon: false,
    element: (data: IInventory) => formatDate(data.datesMedicine[0].admissionDate),
  },
  {
    label: "Fecha de Expiración",
    column: "expirationDate",
    visible: true,
    isIcon: false,
    element: (data: IInventory) => formatDate(data.datesMedicine[0].expirationDate),
    // className: (data: IInventory) => {
    //   if (isExpired(data.datesMedicine[0].expirationDate, false)) {
    //     return "expired-date"
    //   } else if (isExpired(data.datesMedicine[0].expirationDate, true)) {
    //     return "expiring-soon-date"
    //   }
    //   return ""
    // },
  },
  {
    label: "Eliminar",
    column: "delete",
    visible: true,
    isIcon: true,
    element: () => "",
    icon: {
      label: "Eliminar medicina",
      icon: FaRegTrashAlt,
      className: "text-red-600",
      variant: "ghost",
    },
  },
];

// const isExpired = (expirationDate: string | Date, soon: boolean) => {
//   const today = new Date();
//   const expDate = new Date(expirationDate);
//   if (soon) return expDate < today;

//   const diffTime = expDate.getTime() - today.getTime()
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//   return diffDays <= 30 && diffDays > 0
// }