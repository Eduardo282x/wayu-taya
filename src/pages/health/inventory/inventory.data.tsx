import { Column } from "@/components/table/table.interface";
import { IInventory, IInventoryHistory } from "@/services/inventory/inventory.interface";
import { formatDate } from "@/utils/formatters";
import { FaRegTrashAlt } from "react-icons/fa";

export const inventoryColumns: Column[] = [
  {
    label: "Medicina",
    column: "medicine.name",
    visible: true,
    isIcon: false,
    element: (data: IInventory) =>
      `${data.medicine.name} ${data.medicine.amount}${data.medicine.unit}`,
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
    element: (data: IInventory) => (
      <span className={`
        px-2 py-1 rounded-full text-xs font-medium
       ${isExpired(data.datesMedicine[0].expirationDate, true)
          ? 'text-[#dc2626] bg-[#eda8a8]' // Vencido
          : isExpired(data.datesMedicine[0].expirationDate, false)
            ? 'bg-[#ffd19c] text-[#ff8800]' // Por vencer
            : 'bg-[#9cd5eb] text-[#184abc]'
        }
`}>
        {formatDate(data.datesMedicine[0].expirationDate)}
      </span>
    ),
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

export const historyColumns: Column[] = [
  {
    label: "Medicina",
    column: "medicine.name",
    visible: true,
    isIcon: false,
    element: (data: IInventoryHistory) => `${data.medicine.name} ${data.medicine.amount}${data.medicine.unit}`,
  },
  {
    label: "Tipo",
    column: "donation.type",
    visible: true,
    isIcon: false,
    element: (data: IInventoryHistory) => (
      <span className={`px - 2 py - 1 rounded - full text - xs font - medium ${data.donation && data.donation.type == 'Entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {data.donation.type}
      </span>
    ),
  },
  {
    label: "Cantidad",
    column: "quantity",
    visible: true,
    isIcon: false,
    element: (data: IInventoryHistory) => `${data.amount} unidades`,
  },
  {
    label: "Fecha",
    column: "date",
    visible: true,
    isIcon: false,
    element: (data: IInventoryHistory) => new Date(data.date).toLocaleDateString(),
  },
  {
    label: "Almacén",
    column: "store",
    visible: true,
    isIcon: false,
    element: (data: IInventoryHistory) => data.store.name,
  },
  {
    label: "Lote",
    column: "lote",
    visible: true,
    isIcon: false,
    element: (data: IInventoryHistory) => data.donation.lote,
  },
  {
    label: "Motivo",
    column: "reason",
    visible: true,
    isIcon: false,
    element: (data: IInventoryHistory) => data.observations ? data.observations : '-',
  },
];

const isExpired = (expirationDate: string | Date, soon: boolean) => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  if (soon) return expDate < today;

  const diffTime = expDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 30 && diffDays > 0;
}
